export const navigation = {
    categories: [
      {
        id: 'women',
        name: 'Women',
        featured: [
          {
            name: 'New Arrivals',
            href: '/',
            imageSrc: 'https://rukminim2.flixcart.com/image/612/612/xif0q/top/c/v/t/s-d-16-angarkha-original-imahc7ha2tgxvaqw.jpeg?q=70',
            imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
          },
          {
            name: 'Basic Tees',
            href: '/',
            imageSrc: 'https://rukminim2.flixcart.com/image/612/612/ku4ezrk0/top/g/s/1/xl-printed-top-fancify-original-imag7bb3yg9xx4yn.jpeg?q=70',
            imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
          },
        ],
        sections: [
          {
            id: 'bottom_wear',
            name: 'Bottom Wear',
            items: [
              { name: 'Formal Pants', id:"formal_pants", href: `{women/bottom_wear/formal_pants}` },
              { name: 'Cotton Pants', id:"cotton_pants", href: '{women/bottom_wear/cotton_pants}' },
              { name: 'Linen Pants', id: 'linen_pants', href: '{women/bottom_wear/linen_pants}' },
              { name: 'Cargo', id:"cargos", href: '{women/bottom_wear/cargos}' },
              { name: 'Track Pants', id: 'track_pants', href: '{women/bottom_wear/track_pants}' },
              { name: 'Jeans', id: 'jeans', href: '{women/bottom_wear/jeans}' },
            ],
          },
          {
            id: 'shirts',
            name: 'Shirts',
            items: [
              { name: 'Formal Shirts', id:"formal_shirts", href: `{women/bottom_wear/formal_shirts}` },
              { name: 'Satin Shirts', id:"satin_shirts", href: '{women/bottom_wear/satin_shirts}' },
              { name: 'Hidden Button Shirts', id: 'hidden_button_shirts', href: '{women/bottom_wear/hidden_button_shirts}' },
            ],
          },
          {
            id: 'tops',
            name: 'Tops',
            items: [
              { name: 'Tanic Tops', id:"tanic_tops", href: `{women/bottom_wear/tanic_tops}` },
              { name: 'Tank Tops', id:"tank_tops", href: '{women/bottom_wear/tank_tops}' },
              { name: 'Peplum Tops', id: 'peplum_tops', href: '{women/bottom_wear/peplum_tops}' },
              { name: 'Crop Tops', id: 'crop_tops', href: '{women/bottom_wear/crop_tops}' },
            ],
          },
                    {
            id: 'kurti',
            name: 'Kurtis',
            items: [
              { name: 'Office Wear Kurti', id:"office_wear_kurtis", href: `{women/bottom_wear/office_wear_kurtis}` },
              { name: 'A Line Kurti', id:"a_line_kurtis", href: '{women/bottom_wear/a_line_kurtis}' },
              { name: 'Kalamkari', id: 'kalamkari', href: '{women/bottom_wear/kalamkari}' },            ],
          },
        ],
      },
    ],
    pages: [
      { name: '', id: '/' },
      { name: '', id: '/' },
    ],
  }