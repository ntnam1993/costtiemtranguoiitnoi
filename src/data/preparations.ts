import type { PreparationIngredient, PreparationRecipe, Unit } from "../domain/models";

const sourceFile = "U UOP NGUYEN LIEU TRA TRAI CAY - THANH VIET (1).docx";
const ingredient = (
  id: string,
  name: string,
  quantity: number,
  unit: Unit,
): PreparationIngredient => ({ id, name, quantity, unit });
const source = (section: string) => ({ file: sourceFile, section });

export const preparations = [
  {
    id: "nhiet-doi",
    name: "Cốt & topping nhiệt đới (mốc 1 kg trái cứng)",
    ingredients: [
      ingredient("trai-cung", "Trái cây cứng hỗn hợp", 1000, "g"),
      ingredient("duong", "Đường", 500, "g"),
      ingredient("sinh-to-xoai", "Sinh tố xoài Berino", 25, "ml"),
      ingredient("sinh-to-oi", "Sinh tố ổi Berino", 25, "ml"),
      ingredient("sinh-to-thom", "Sinh tố thơm Berino", 25, "ml"),
      ingredient("sinh-to-chanh-day", "Sinh tố chanh dây Berino", 25, "ml"),
      ingredient("sinh-to-dao", "Sinh tố đào Berino", 25, "ml"),
      ingredient("sinh-to-dau", "Sinh tố dâu tây Berino", 25, "ml"),
      ingredient("chanh-day-tuoi", "Chanh dây tươi", 50, "ml"),
      ingredient("cot-atiso", "Nước cốt atiso", 25, "ml"),
    ],
    notes: [
      "Tài liệu yêu cầu tối thiểu 6–8 loại trái cây; trái mềm được thêm trước bán ít nhất 3 giờ.",
      "Muối ghi theo tỉ lệ thông thường nên không đưa vào phép tính khi chưa có định lượng.",
      "Ủ mát ít nhất một đêm; ngon nhất trong khoảng 2 ngày.",
    ],
    source: source("TRÀ TRÁI CÂY NHIỆT ĐỚI"),
  },
  {
    id: "mang-cau",
    name: "Mãng cầu ủ đường",
    ingredients: [
      ingredient("mang-cau", "Mãng cầu đã sơ chế", 1000, "g"),
      ingredient("duong", "Đường", 300, "g"),
    ],
    notes: ["Cấp mát tối thiểu 4 giờ, ngon nhất sau một đêm ở 6–8°C."],
    source: source("TRÀ MÃNG CẦU"),
  },
  {
    id: "xoai-chanh-day",
    name: "Xoài chanh dây ủ",
    ingredients: [
      ingredient("xoai", "Xoài keo / Tứ quý", 1000, "g"),
      ingredient("duong", "Đường", 500, "g"),
      ingredient("sinh-to-chanh-day", "Sinh tố chanh dây Berino", 50, "ml"),
      ingredient("sinh-to-xoai", "Sinh tố xoài Berino", 120, "ml"),
    ],
    notes: ["Ủ mát tối thiểu một đêm; ngon nhất từ hai ngày."],
    source: source("TRÀ XOÀI CHANH DÂY"),
  },
  {
    id: "oi-hong",
    name: "Ổi hồng ủ",
    ingredients: [
      ingredient("oi-rubi", "Ổi Rubi", 1000, "g"),
      ingredient("duong", "Đường", 500, "g"),
      ingredient("sinh-to-oi", "Sinh tố ổi Berino", 120, "ml"),
    ],
    notes: ["Ủ mát ít nhất 8 giờ; tốt nhất hai đêm."],
    source: source("TRÀ ỔI HỒNG"),
  },
  {
    id: "dau-tay",
    name: "Dâu tây ủ",
    ingredients: [
      ingredient("dau-tay", "Dâu tây", 1000, "g"),
      ingredient("duong", "Đường", 500, "g"),
      ingredient("sinh-to-dau", "Sinh tố dâu Berino", 120, "ml"),
    ],
    notes: ["Sên nhẹ đến khi xuất hiện cột hơi rồi tắt; để mát 1–2 đêm."],
    source: source("TRÀ DÂU TÂY"),
  },
  {
    id: "man-hau",
    name: "Mận hậu ủ",
    ingredients: [ingredient("man", "Mận hậu", 1000, "g"), ingredient("duong", "Đường", 500, "g")],
    notes: ["Ủ mát một đêm, ngon nhất từ hai đêm."],
    source: source("TRÀ MẬN HẬU"),
  },
  {
    id: "dua-luoi",
    name: "Dưa lưới ủ",
    ingredients: [
      ingredient("dua-luoi", "Dưa lưới", 1000, "g"),
      ingredient("duong", "Đường", 500, "g"),
      ingredient("sinh-to-dua-luoi", "Sinh tố dưa lưới GoldenFarm", 120, "ml"),
    ],
    notes: ["Giữ khô khi sơ chế; ủ mát qua đêm."],
    source: source("TRÀ DƯA LƯỚI"),
  },
  {
    id: "sau-rieng",
    name: "Cốt sầu riêng",
    ingredients: [
      ingredient("sau-rieng", "Thịt sầu riêng Ri6", 1000, "g"),
      ingredient("duong", "Đường", 500, "g"),
    ],
    notes: ["Dùng 1/2 thìa muối theo tài liệu; chưa tính vì không có quy đổi khối lượng."],
    source: source("TRÀ SẦU RIÊNG DỨA"),
  },
  {
    id: "coc",
    name: "Cóc ủ",
    ingredients: [
      ingredient("coc", "Cóc cầy đã sơ chế", 1000, "g"),
      ingredient("duong", "Đường", 500, "g"),
    ],
    notes: ["Ủ mát ít nhất 2 giờ; ngon nhất sau 1–2 đêm."],
    source: source("TRÀ CÓC THƠM"),
  },
  {
    id: "thom",
    name: "Thơm ủ",
    ingredients: [
      ingredient("thom", "Thơm đã sơ chế", 1000, "g"),
      ingredient("duong", "Đường", 500, "g"),
    ],
    notes: ["Ủ nhiệt độ phòng 2 giờ rồi cấp mát; bán tối đa 2 ngày."],
    source: source("TRÀ THƠM CHANH DÂY"),
  },
  {
    id: "thanh-xoai",
    name: "Thanh long xoài ủ",
    ingredients: [
      ingredient("thanh-long", "Thanh long ruột đỏ", 1000, "g"),
      ingredient("xoai", "Xoài chín", 1000, "g"),
      ingredient("duong", "Đường", 1000, "g"),
      ingredient("sinh-to-xoai", "Sinh tố xoài Berino", 150, "ml"),
    ],
    notes: ["Tỉ lệ xoài và thanh long gần bằng nhau; ủ mát một đêm là ngon nhất."],
    source: source("TRÀ THANH XOÀI"),
  },
  {
    id: "nhan",
    name: "Nhãn ủ lá dứa",
    ingredients: [
      ingredient("nhan", "Cùi nhãn", 1000, "g"),
      ingredient("duong", "Đường", 800, "g"),
      ingredient("nuoc", "Nước", 800, "ml"),
      ingredient("la-dua", "Lá dứa", 20, "g"),
    ],
    notes: ["Tài liệu cho phép tỉ lệ 500 hoặc 800 g/ml; mốc 800 dùng khi cần nhiều nước cốt."],
    source: source("TRÀ NHÃN"),
  },
  {
    id: "mit",
    name: "Mít ủ",
    ingredients: [
      ingredient("mit", "Mít đã sơ chế", 1000, "g"),
      ingredient("duong", "Đường", 500, "g"),
    ],
    notes: ["Chanh dây được thêm lúc pha, không cho vào mẻ ủ."],
    source: source("TRÀ MÍT CHANH DÂY"),
  },
  {
    id: "tao-chanh",
    name: "Táo chanh ủ",
    ingredients: [
      ingredient("tao", "Táo đỏ / Táo Envy", 1000, "g"),
      ingredient("duong", "Đường", 500, "g"),
      ingredient("sinh-to-chanh-day", "Sinh tố chanh dây", 50, "ml"),
    ],
    notes: ["Ngâm ủ qua đêm và bảo quản mát; chanh Quảng Đông dùng khi pha."],
    source: source("TRÀ XUÂN HẠ (CHANH TÁO THANH MÁT)"),
  },
  {
    id: "atiso",
    name: "Atiso đỏ ủ",
    ingredients: [
      ingredient("atiso", "Hoa atiso đỏ", 1000, "g"),
      ingredient("duong", "Đường", 1000, "g"),
      ingredient("sinh-to-dau", "Sinh tố dâu tây Berino", 30, "ml"),
    ],
    notes: ["Sên nhẹ đến khi xuất hiện cột hơi; bảo quản mát khoảng 2 tháng."],
    source: source("TRÀ ATISO"),
  },
  {
    id: "dau-tam",
    name: "Dâu tằm ủ",
    ingredients: [
      ingredient("dau-tam", "Dâu tằm", 1000, "g"),
      ingredient("duong", "Đường", 500, "g"),
      ingredient("sinh-to-dau-tam", "Sinh tố dâu tằm GoldenFarm", 120, "ml"),
    ],
    notes: ["Sên nhiệt nhẹ; bảo quản tối đa một tuần, ngon nhất 2–3 ngày."],
    source: source("TRÀ DÂU TẰM"),
  },
  {
    id: "dac-cam",
    name: "Đác cam chanh",
    ingredients: [
      ingredient("dac", "Hạt đác", 1000, "g"),
      ingredient("nuoc-cam", "Nước cam", 1000, "ml"),
      ingredient("duong-dac", "Đường ướp đác", 500, "g"),
      ingredient("duong-cam", "Đường cho nước cam", 300, "g"),
      ingredient("chanh-day", "Chanh dây", 5, "trái"),
    ],
    notes: ["Tỉ lệ đác và nước cam 1:1; nấu 30–40 phút, tối đa một giờ."],
    source: source("CAM ĐÁC CHANH"),
  },
  {
    id: "dac-dau-tam",
    name: "Đác dâu tằm",
    ingredients: [
      ingredient("dac", "Hạt đác", 1000, "g"),
      ingredient("duong", "Đường", 500, "g"),
      ingredient("cot-dau-tam", "Nước cốt dâu tằm", 150, "ml"),
      ingredient("xac-dau-tam", "Xác dâu tằm", 150, "g"),
      ingredient("sinh-to-dau-tam", "Sinh tố dâu tằm GoldenFarm", 100, "ml"),
    ],
    notes: ["Nấu tối đa 40 phút; cấp mát 4–6 giờ trước khi bán."],
    source: source("ĐÁC DÂU TẰM THƠM DẺO"),
  },
  {
    id: "dac-thom",
    name: "Đác thơm",
    ingredients: [
      ingredient("dac", "Hạt đác", 1000, "g"),
      ingredient("duong-phen", "Đường phèn", 200, "g"),
      ingredient("duong-vang", "Đường cát vàng", 100, "g"),
      ingredient("thom", "Thơm tươi", 500, "g"),
      ingredient("sinh-to-thom", "Sinh tố thơm Berino", 50, "ml"),
      ingredient("sinh-to-chanh-day", "Sinh tố chanh dây", 20, "ml"),
      ingredient("chanh-day-tuoi", "Chanh dây tươi", 50, "ml"),
    ],
    notes: ["Nấu 20–25 phút; để mát tối thiểu 24 giờ trước khi bán."],
    source: source("ĐÁC THƠM"),
  },
  {
    id: "me-dam-vi",
    name: "Cốt me đậm vị",
    ingredients: [
      ingredient("thit-me", "Thịt me đã ray", 1000, "g"),
      ingredient("duong", "Đường", 1800, "g"),
      ingredient("thom", "Thơm chín", 800, "g"),
      ingredient("sinh-to-me", "Sinh tố me GoldenFarm", 150, "ml"),
    ],
    notes: ["Nấu me và đường trước; thêm hỗn hợp sinh tố rồi sên tối đa 20 phút."],
    source: source("ĐÁC ME ĐẬM VỊ — Cốt me đậm vị"),
  },
] satisfies readonly PreparationRecipe[];
