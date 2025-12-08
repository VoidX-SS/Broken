export const translations = {
  vi: {
    settings: {
      language: 'Ngôn ngữ',
    },
    categories: {
      Top: 'Áo',
      Bottom: 'Quần',
      Outerwear: 'Đồ khoác ngoài',
      Footwear: 'Giày dép',
      Accessory: 'Phụ kiện',
      Dress: 'Váy',
    },
    wardrobeDisplay: {
      title: 'Tủ đồ của tôi',
      button: 'Thêm đồ',
    },
    emptyWardrobe: {
      title: 'Tủ đồ của bạn đang trống',
      description: 'Bắt đầu bằng cách thêm các món đồ vào tủ để nhận gợi ý phong cách cá nhân.',
      button: 'Thêm món đồ đầu tiên',
    },
    addItemDialog: {
      title: 'Thêm vào tủ đồ',
      description: 'Tải ảnh món đồ của bạn lên. AI sẽ tự động tạo mô tả cho bạn.',
      photoLabel: 'Ảnh',
      photoAlt: 'Xem trước ảnh tải lên',
      uploadHint: 'Nhấn để tải lên hoặc kéo thả',
      uploadLimit: 'PNG, JPG, WEBP tối đa 4MB',
      categoryLabel: 'Danh mục',
      categoryPlaceholder: 'Chọn một danh mục',
      descriptionLabel: 'Mô tả',
      descriptionPlaceholder: 'ví dụ: Áo khoác jean xanh',
      descriptionHint: 'AI sẽ tự tạo mô tả này. Bạn có thể chỉnh sửa nếu cần.',
      generateDescriptionAria: 'Tạo mô tả',
      submitButton: 'Thêm món đồ',
    },
    deleteDialog: {
      title: 'Bạn có chắc không?',
      description: 'Hành động này không thể hoàn tác. Món đồ này sẽ bị xóa vĩnh viễn khỏi tủ đồ của bạn.',
      cancel: 'Hủy',
      confirm: 'Xóa',
      ariaLabel: 'Xóa món đồ',
    },
    stylingAssistant: {
      title: 'Trợ lý phong cách AI',
      initialMessage: 'Xin chào! Hãy cho tôi biết về dịp và thời tiết, tôi sẽ gợi ý một bộ trang phục từ tủ đồ của bạn.',
      loading: 'Đang tạo kiểu',
      occasion: 'Dịp',
      weather: 'Thời tiết',
      occasionPlaceholder: 'ví dụ: Cà phê với bạn bè',
      weatherPlaceholder: 'ví dụ: Nắng và ấm',
      button: 'Nhận gợi ý',
    },
    toast: {
      fileTooLarge: {
        title: 'Tệp quá lớn',
        description: 'Vui lòng tải lên ảnh nhỏ hơn 4MB.',
      },
      fileReadError: {
        title: 'Lỗi đọc tệp',
        description: 'Không thể đọc ảnh đã chọn. Vui lòng thử ảnh khác.',
      },
      genericError: {
        title: 'Ôi không!',
      },
      descriptionGenerationError: 'Không thể tạo mô tả cho ảnh. Vui lòng viết mô tả thủ công.',
      suggestionError: 'Tôi không thể nghĩ ra một gợi ý. Vui lòng thử lại.',
      emptyWardrobe: {
        title: 'Tủ đồ trống',
        description: 'Vui lòng thêm một vài món đồ vào tủ trước khi yêu cầu gợi ý.',
      },
    },
  },
  en: {
    settings: {
      language: 'Language',
    },
    categories: {
      Top: 'Top',
      Bottom: 'Bottom',
      Outerwear: 'Outerwear',
      Footwear: 'Footwear',
      Accessory: 'Accessory',
      Dress: 'Dress',
    },
    wardrobeDisplay: {
      title: 'My Wardrobe',
      button: 'Add Item',
    },
    emptyWardrobe: {
      title: 'Your wardrobe is empty',
      description: 'Start by adding your clothing items to get personalized style suggestions.',
      button: 'Add Your First Item',
    },
    addItemDialog: {
      title: 'Add to Wardrobe',
      description: 'Upload a picture of your clothing item. The AI will generate a description for you.',
      photoLabel: 'Photo',
      photoAlt: 'Preview of uploaded item',
      uploadHint: 'Click to upload or drag & drop',
      uploadLimit: 'PNG, JPG, WEBP up to 4MB',
      categoryLabel: 'Category',
      categoryPlaceholder: 'Select a category',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'e.g., Blue denim jacket',
      descriptionHint: 'The AI will generate this automatically. You can edit it if needed.',
      generateDescriptionAria: 'Generate description',
      submitButton: 'Add Item',
    },
    deleteDialog: {
      title: 'Are you sure?',
      description: 'This action cannot be undone. This will permanently delete this item from your wardrobe.',
      cancel: 'Cancel',
      confirm: 'Delete',
      ariaLabel: 'Delete item',
    },
    stylingAssistant: {
      title: 'AI Styling Assistant',
      initialMessage: "Hello! Tell me the occasion and weather, and I'll suggest an outfit from your wardrobe.",
      loading: 'Styling',
      occasion: 'Occasion',
      weather: 'Weather',
      occasionPlaceholder: 'e.g., Casual brunch',
      weatherPlaceholder: 'e.g., Sunny and warm',
      button: 'Get Suggestion',
    },
    toast: {
      fileTooLarge: {
        title: 'File too large',
        description: 'Please upload an image smaller than 4MB.',
      },
      fileReadError: {
        title: 'Error reading file',
        description: 'Could not read the selected image. Please try another.',
      },
      genericError: {
        title: 'Oh no!',
      },
      descriptionGenerationError: 'Could not generate a description for the image. Please write one manually.',
      suggestionError: "I couldn't come up with a suggestion. Please try again.",
      emptyWardrobe: {
        title: 'Empty Wardrobe',
        description: 'Please add some items to your wardrobe before asking for suggestions.',
      },
    },
  },
};

export type Translation = typeof translations.en;
