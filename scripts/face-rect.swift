// Đọc khung mặt của một ảnh bằng Vision framework của macOS, in ra JSON để script Node
// dùng lại. Cần cho gen-faculty-image.mjs: các card giảng viên chụp xa gần khác nhau, muốn
// xếp thành một hàng mà đầu người bằng nhau thì phải quy chuẩn theo chiều cao khuôn mặt
// chứ không phải theo chiều cao ảnh.
//
// Phải biên dịch rồi chạy, giống cutout.swift — `swift scripts/face-rect.swift` sẽ lỗi vì
// trình thông dịch không link được framework Vision:
//
//   /usr/bin/swiftc -O -framework Vision -framework AppKit -o /tmp/face-rect scripts/face-rect.swift
//   /tmp/face-rect <ảnh>
//
// In ra khung mặt lớn nhất tìm được, toạ độ pixel gốc trên-trái:
//   {"x":914,"y":142,"width":328,"height":328}

import AppKit
import Vision

let args = CommandLine.arguments
guard args.count >= 2 else {
    FileHandle.standardError.write("Dùng: face-rect <ảnh>\n".data(using: .utf8)!)
    exit(2)
}

let url = URL(fileURLWithPath: args[1])
guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
      let cgImage = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
    FileHandle.standardError.write("Không đọc được ảnh: \(url.path)\n".data(using: .utf8)!)
    exit(1)
}

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
let request = VNDetectFaceRectanglesRequest()

do {
    try handler.perform([request])
} catch {
    FileHandle.standardError.write("Vision lỗi: \(error)\n".data(using: .utf8)!)
    exit(1)
}

// Card có thể lọt mặt trên logo hoặc hình in trên áo — lấy khung lớn nhất, đó là chủ thể.
guard let face = request.results?.max(by: { $0.boundingBox.height < $1.boundingBox.height })
else {
    FileHandle.standardError.write("Không tìm thấy khuôn mặt nào trong \(url.path)\n".data(using: .utf8)!)
    exit(1)
}

// boundingBox của Vision là toạ độ chuẩn hoá, gốc ở góc dưới-trái; đổi sang pixel trên-trái.
let imageWidth = Double(cgImage.width)
let imageHeight = Double(cgImage.height)
let box = face.boundingBox
let x = Int((box.minX * imageWidth).rounded())
let y = Int(((1 - box.maxY) * imageHeight).rounded())
let width = Int((box.width * imageWidth).rounded())
let height = Int((box.height * imageHeight).rounded())

print("{\"x\":\(x),\"y\":\(y),\"width\":\(width),\"height\":\(height)}")
