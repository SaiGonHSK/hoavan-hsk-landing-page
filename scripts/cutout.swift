// Tách nền ảnh người bằng Vision framework của macOS (subject lifting) — cùng cơ chế
// với thao tác "Remove Background" trong Preview, không cần tải model hay dịch vụ ngoài.
//
// Phải biên dịch rồi chạy; `swift scripts/cutout.swift` sẽ lỗi vì trình thông dịch
// không link được framework Vision:
//
//   /usr/bin/swiftc -O -framework Vision -framework AppKit -framework CoreImage \
//     -o /tmp/cutout scripts/cutout.swift
//   /tmp/cutout <ảnh-vào> <ảnh-ra.png>
//
// Lưu ý phải dùng /usr/bin/swiftc (toolchain Xcode), không dùng swiftc của swiftly.

import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("Dùng: cutout.swift <input> <output.png>\n".data(using: .utf8)!)
    exit(2)
}

let inputURL = URL(fileURLWithPath: args[1])
let outputURL = URL(fileURLWithPath: args[2])

guard let source = CGImageSourceCreateWithURL(inputURL as CFURL, nil),
      let cgImage = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
    FileHandle.standardError.write("Không đọc được ảnh: \(inputURL.path)\n".data(using: .utf8)!)
    exit(1)
}

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()

do {
    try handler.perform([request])
} catch {
    FileHandle.standardError.write("Vision lỗi: \(error)\n".data(using: .utf8)!)
    exit(1)
}

guard let result = request.results?.first else {
    FileHandle.standardError.write("Không tìm thấy chủ thể nào trong ảnh.\n".data(using: .utf8)!)
    exit(1)
}

// allInstances gộp mọi chủ thể tách được — giữ cả hai người nếu ảnh có hai người.
let instances = result.allInstances
FileHandle.standardError.write("Tìm thấy \(instances.count) chủ thể.\n".data(using: .utf8)!)

guard let masked = try? result.generateMaskedImage(
    ofInstances: instances,
    from: handler,
    croppedToInstancesExtent: true
) else {
    FileHandle.standardError.write("Không tạo được ảnh đã tách nền.\n".data(using: .utf8)!)
    exit(1)
}

let ciImage = CIImage(cvPixelBuffer: masked)
let context = CIContext()
guard let colorSpace = CGColorSpace(name: CGColorSpace.sRGB),
      let png = context.pngRepresentation(
        of: ciImage,
        format: .RGBA8,
        colorSpace: colorSpace
      ) else {
    FileHandle.standardError.write("Không mã hoá được PNG.\n".data(using: .utf8)!)
    exit(1)
}

try png.write(to: outputURL)
print("Đã ghi \(outputURL.path) — \(Int(ciImage.extent.width))x\(Int(ciImage.extent.height))")
