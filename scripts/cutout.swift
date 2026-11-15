// Step 2 of the render pipeline: turns each photo into a transparent PNG "render"
// using Apple's on-device Vision subject-lifting (macOS 14+).
// Usage: swift scripts/cutout.swift <in_dir> <out_dir>
import Foundation
import Vision
import CoreImage
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
let inDir = URL(fileURLWithPath: args[1]), outDir = URL(fileURLWithPath: args[2])
try? FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)
let ctx = CIContext()
let files = (try FileManager.default.contentsOfDirectory(at: inDir, includingPropertiesForKeys: nil)).filter { $0.pathExtension == "jpg" }
var ok = 0
for f in files.sorted(by: { $0.path < $1.path }) {
  let out = outDir.appendingPathComponent(f.deletingPathExtension().lastPathComponent + ".png")
  if FileManager.default.fileExists(atPath: out.path) && !args.contains("--force") { ok += 1; continue }
  guard let src = CIImage(contentsOf: f, options: [.applyOrientationProperty: true]) else { print("read fail", f.lastPathComponent); continue }
  let handler = VNImageRequestHandler(ciImage: src)
  let req = VNGenerateForegroundInstanceMaskRequest()
  do {
    try handler.perform([req])
    guard let res = req.results?.first, !res.allInstances.isEmpty else { print("no subject", f.lastPathComponent); continue }
    // keep the largest instance (the wrestler), drop bystanders
    var best = res.allInstances.first!, bestArea = 0
    for i in res.allInstances {
      let m = try res.generateScaledMaskForImage(forInstances: [i], from: handler)
      let w = CVPixelBufferGetWidth(m), h = CVPixelBufferGetHeight(m)
      CVPixelBufferLockBaseAddress(m, .readOnly)
      let base = CVPixelBufferGetBaseAddress(m)!.assumingMemoryBound(to: Float32.self)
      let stride = CVPixelBufferGetBytesPerRow(m) / 4
      var area = 0
      for y in Swift.stride(from: 0, to: h, by: 4) { for x in Swift.stride(from: 0, to: w, by: 4) where base[y * stride + x] > 0.5 { area += 1 } }
      CVPixelBufferUnlockBaseAddress(m, .readOnly)
      if area > bestArea { bestArea = area; best = i }
    }
    let buf = try res.generateMaskedImage(ofInstances: [best], from: handler, croppedToInstancesExtent: true)
    var img = CIImage(cvPixelBuffer: buf)
    let maxH: CGFloat = 480
    if img.extent.height > maxH { let s = maxH / img.extent.height; img = img.transformed(by: CGAffineTransform(scaleX: s, y: s)) }
    guard let cg = ctx.createCGImage(img, from: img.extent) else { continue }
    guard let dest = CGImageDestinationCreateWithURL(out as CFURL, UTType.png.identifier as CFString, 1, nil) else { continue }
    CGImageDestinationAddImage(dest, cg, nil)
    CGImageDestinationFinalize(dest)
    ok += 1
  } catch { print("err", f.lastPathComponent, error) }
}
print("done \(ok)/\(files.count)")
