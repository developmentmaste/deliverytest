import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Shop, Product, Promo } from './models';

dotenv.config();

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clover-delivery';

const SHOPS_DATA = [
  { name: 'Borscht House',   cuisine: 'Ukrainian', rating: 4.9, time: '15–20 min', emoji: '🍲', badge: 'Popular' },
  { name: 'Dumpling House #1',    cuisine: 'Ukrainian', rating: 4.7, time: '20–25 min', emoji: '🥟', badge: null },
  { name: 'Cossack Tavern', cuisine: 'Ukrainian', rating: 4.5, time: '25–35 min', emoji: '🫕', badge: null },
  { name: 'Galician Kitchen',  cuisine: 'Ukrainian', rating: 4.8, time: '20–30 min', emoji: '🥣', badge: 'New' },
  { name: 'Sakura Ramen',    cuisine: 'Asian',   rating: 4.6, time: '20–25 min', emoji: '🍜', badge: null },
  { name: 'Dragon Wok',      cuisine: 'Азійська',   rating: 4.5, time: '20–28 хв', emoji: '🥡', badge: null },
  { name: 'La Bella Pasta',  cuisine: 'Італійська', rating: 4.3, time: '25–30 хв', emoji: '🍝', badge: null },
  { name: 'Pizza Paradiso',  cuisine: 'Італійська', rating: 3.5, time: '30–40 хв', emoji: '🍕', badge: null },
  { name: 'Smoothie Lab',    cuisine: 'Здорове',    rating: 4.9, time: '8–12 хв',  emoji: '🥤', badge: '⭐ Топ' },
];

// products per shop index
const PRODUCTS_DATA = [
  // 0 — Хата з борщем
  [
    { name: 'Борщ з пампушками',    category: 'Перші страви',   price: 129, emoji: '🍲', desc: 'Класичний червоний борщ на свинячих реберцях, сметана, часникові пампушки' },
    { name: 'Юшка рибна',           category: 'Перші страви',   price: 115, emoji: '🐟', desc: 'Прозорий бульйон зі судака, картопля, морква, лавровий лист' },
    { name: 'Капусняк',             category: 'Перші страви',   price: 109, emoji: '🥣', desc: 'Кислий суп з квашеної капусти, пшоно, свинина' },
    { name: 'Деруни зі сметаною',   category: 'Закуски',        price: 95,  emoji: '🥔', desc: 'Картопляні оладки, хрустка скоринка, домашня сметана' },
    { name: 'Оселедець під шубою',  category: 'Закуски',        price: 89,  emoji: '🥗', desc: 'Класичний салат: оселедець, буряк, морква, яйця, майонез' },
    { name: 'Бринза з зеленню',     category: 'Закуски',        price: 69,  emoji: '🧀', desc: 'Домашня бринза, свіжа зелень, олія, чорний хліб' },
    { name: 'Котлета по-київськи',  category: 'Основні страви', price: 189, emoji: '🍗', desc: 'Куряче філе з вершковим маслом і зеленню в хрусткій панірівці' },
    { name: 'Печеня по-домашньому', category: 'Основні страви', price: 175, emoji: '🫕', desc: 'Свинина з картоплею і цибулею у горщику' },
    { name: 'Вареники з картоплею', category: 'Основні страви', price: 89,  emoji: '🥟', desc: 'Картопляна начинка зі шкварками та засмажкою цибулі' },
    { name: 'Узвар',                category: 'Напої',          price: 45,  emoji: '🍵', desc: 'Компот із сухофруктів: груші, яблука, чорнослив' },
    { name: 'Квас хлібний',         category: 'Напої',          price: 55,  emoji: '🍺', desc: 'Живий хлібний квас, темний, легка кислинка' },
    { name: 'Медовик',              category: 'Десерти',        price: 79,  emoji: '🍰', desc: 'Медовий торт з ніжним сметанним кремом, 8 шарів' },
    { name: 'Вареники з вишнею',    category: 'Десерти',        price: 85,  emoji: '🫐', desc: 'Домашні вареники з свіжою вишнею, цукор, сметана' },
  ],
  // 1 — Вареничня №1
  [
    { name: 'Вареники з картоплею', category: 'Вареники',     price: 89,  emoji: '🥟', desc: 'Картопляна начинка зі шкварками та засмажкою цибулі' },
    { name: "Вареники з м'ясом",   category: 'Вареники',     price: 109, emoji: '🥟', desc: "Начинка зі свинини та яловичини, цибуля, чорний перець" },
    { name: 'Вареники з сиром',    category: 'Вареники',     price: 85,  emoji: '🧀', desc: 'Домашній сир, яйце, ваніль — подаються зі сметаною' },
    { name: 'Вареники з капустою', category: 'Вареники',     price: 79,  emoji: '🥬', desc: 'Тушкована капуста з морквою і цибулею' },
    { name: 'Вареники з вишнею',   category: 'Вареники',     price: 85,  emoji: '🍒', desc: 'Свіжа вишня, цукор, подаються теплими зі сметаною' },
    { name: 'Вареники з грибами',  category: 'Вареники',     price: 95,  emoji: '🍄', desc: 'Білі гриби з цибулею, чорний перець, сметана' },
    { name: 'Шкварки з цибулею',   category: 'До вареників', price: 45,  emoji: '🧅', desc: 'Домашні шкварки з карамелізованою цибулею' },
    { name: 'Сметана домашня',     category: 'До вареників', price: 35,  emoji: '🥛', desc: '100 г жирної домашньої сметани' },
    { name: 'Масло вершкове',      category: 'До вареників', price: 25,  emoji: '🧈', desc: 'Розтоплене вершкове масло, 50 г' },
    { name: 'Квас хлібний',        category: 'Напої',        price: 55,  emoji: '🍺', desc: 'Живий хлібний квас, темний, легка кислинка' },
    { name: 'Компот з вишні',      category: 'Напої',        price: 45,  emoji: '🍒', desc: 'Охолоджений компот з свіжої вишні' },
    { name: 'Сирники з джемом',    category: 'Десерти',      price: 89,  emoji: '🍮', desc: 'Пишні сирники з сиру, ванільний аромат, полунична варення' },
  ],
  // 2 — Шинок Козацький
  [
    { name: 'Холодець',             category: 'Закуски',        price: 99,  emoji: '🍖', desc: 'Домашній холодець зі свинячих ніжок, хрін, гірчиця' },
    { name: 'Сало з часником',      category: 'Закуски',        price: 75,  emoji: '🧄', desc: 'Солоне сало, підмаринований часник, чорний хліб' },
    { name: 'Мариновані огірки',    category: 'Закуски',        price: 55,  emoji: '🥒', desc: 'Хрусткі бочкові огірки з кропом і часником' },
    { name: 'Грибний суп',          category: 'Перші страви',   price: 99,  emoji: '🍄', desc: 'Суп з білих грибів, картопля, ячмінь, сметана' },
    { name: 'Борщ козацький',       category: 'Перші страви',   price: 135, emoji: '🍲', desc: 'Борщ з яловичиною та квасолею, пампушка з часником' },
    { name: 'Голубці',              category: 'Основні страви', price: 159, emoji: '🫕', desc: "Капустяні голубці з м'ясом та рисом у томатному соусі" },
    { name: 'Смажена форель',       category: 'Основні страви', price: 245, emoji: '🐟', desc: 'Ціла форель на грилі, лимон, зелень, картопля на гарнір' },
    { name: "Налисники з м'ясом",  category: 'Основні страви', price: 135, emoji: '🫔', desc: "Млинці з яловичиною та свининою, запечені у сметанному соусі" },
    { name: 'Крупник',              category: 'Основні страви', price: 119, emoji: '🥣', desc: 'Гречана каша з яловичиною у горщику, топлене масло' },
    { name: 'Вишнівка',             category: 'Напої',          price: 89,  emoji: '🍒', desc: 'Домашній вишневий наливок, 50 мл' },
    { name: "Узвар із м'ятою",     category: 'Напої',          price: 49,  emoji: '🍵', desc: "Компот із сухофруктів зі свіжою м'ятою та медом" },
    { name: 'Яблучний штрудель',    category: 'Десерти',        price: 89,  emoji: '🍎', desc: 'Листкове тісто, запечені яблука з корицею, ванільне морозиво' },
    { name: 'Пампушки з маком',     category: 'Десерти',        price: 69,  emoji: '🍞', desc: 'Здобні пампушки з маковою начинкою, медова глазур' },
  ],
  // 3 — Галицька кухня
  [
    { name: 'Жур',                  category: 'Перші страви',   price: 109, emoji: '🥣', desc: 'Галицький кисільний суп на вівсяному відварі, яйце, ковбаса' },
    { name: 'Крупник по-галицьки',  category: 'Перші страви',   price: 115, emoji: '🍲', desc: 'Перловий суп з копченими реберцями, коренева зелень' },
    { name: 'Бануш',                category: 'Основні страви', price: 149, emoji: '🍳', desc: 'Гуцульська кукурудзяна каша на сметані з бринзою та шкварками' },
    { name: 'Мачанка',              category: 'Основні страви', price: 165, emoji: '🫕', desc: 'Свиняча підчеревина у томатно-цибульному соусі, деруни' },
    { name: 'Верещака',             category: 'Основні страви', price: 175, emoji: '🍖', desc: 'Свинина у кисло-солодкому соусі на основі квасу, гречка' },
    { name: 'Галицькі пироги',      category: 'Закуски',        price: 99,  emoji: '🥟', desc: 'Печені пироги з квасолею та цибулею, хрустка скоринка' },
    { name: 'Кисіль вівсяний',      category: 'Напої',          price: 49,  emoji: '🥛', desc: 'Традиційний вівсяний кисіль, злегка підсолоджений медом' },
    { name: 'Яблуковий збитень',    category: 'Напої',          price: 55,  emoji: '🍎', desc: 'Гарячий напій з яблук, кориці, гвоздики та меду' },
    { name: 'Медівник',             category: 'Десерти',        price: 75,  emoji: '🍰', desc: 'Галицький пряник на меду з горіховою начинкою' },
    { name: 'Вергуни',              category: 'Десерти',        price: 65,  emoji: '🍩', desc: 'Смажені у олії тісто-завитки, присипані цукровою пудрою' },
  ],
  // 4 — Sakura Ramen
  [
    { name: 'Tonkotsu Ramen',  category: 'Рамен',   price: 159, emoji: '🍜', desc: 'Rich pork bone broth, chashu, soft egg, nori' },
    { name: 'Spicy Miso Ramen',category: 'Рамен',   price: 149, emoji: '🌶️', desc: 'Miso broth, chili oil, corn, butter' },
    { name: 'Shoyu Ramen',     category: 'Рамен',   price: 139, emoji: '🥢', desc: 'Soy-based clear broth, chicken, scallion' },
    { name: 'Gyoza (6 шт)',    category: 'Закуски', price: 89,  emoji: '🥟', desc: 'Pan-fried pork dumplings, ponzu dip' },
    { name: 'Karaage',         category: 'Закуски', price: 109, emoji: '🍗', desc: 'Japanese fried chicken, kewpie mayo' },
    { name: 'Edamame',         category: 'Закуски', price: 65,  emoji: '🫘', desc: 'Steamed salted soybeans' },
    { name: 'Matcha Ice Cream',category: 'Десерти', price: 69,  emoji: '🍵', desc: 'Premium matcha soft serve' },
    { name: 'Japanese Soda',   category: 'Напої',   price: 55,  emoji: '🫧', desc: 'Yuzu, lychee, or melon' },
  ],
  // 5 — Dragon Wok
  [
    { name: 'Dim Sum (8 шт)',    category: 'Закуски', price: 129, emoji: '🥢', desc: 'Har gow, siu mai, cheung fun' },
    { name: 'Kung Pao Chicken', category: 'Основне', price: 149, emoji: '🍲', desc: 'Wok-fried, peanuts, dried chilies, scallion' },
    { name: 'Fried Rice',       category: 'Основне', price: 129, emoji: '🍚', desc: 'Egg fried rice, char siu, vegetables' },
    { name: 'Pad Thai',         category: 'Основне', price: 155, emoji: '🍜', desc: 'Rice noodles, shrimp, peanuts, tamarind sauce' },
    { name: 'Bubble Tea',       category: 'Напої',   price: 75,  emoji: '🧋', desc: 'Taro, matcha, or brown sugar milk tea' },
  ],
  // 6 — La Bella Pasta
  [
    { name: 'Spaghetti Carbonara', category: 'Паста',   price: 179, emoji: '🍝', desc: 'Guanciale, egg, pecorino romano, black pepper' },
    { name: 'Penne Arrabbiata',    category: 'Паста',   price: 149, emoji: '🍅', desc: 'Spicy tomato sauce, garlic, parsley' },
    { name: 'Fettuccine Alfredo',  category: 'Паста',   price: 169, emoji: '🧀', desc: 'Cream sauce, parmesan, butter, fresh pasta' },
    { name: 'Bruschetta',          category: 'Закуски', price: 89,  emoji: '🍞', desc: 'Toasted bread, tomato, basil, olive oil' },
    { name: 'Tiramisu',            category: 'Десерти', price: 99,  emoji: '☕', desc: 'Classic Italian, espresso soaked, mascarpone' },
    { name: 'Sparkling Water',     category: 'Напої',   price: 45,  emoji: '💧', desc: 'Italian sparkling, San Pellegrino' },
  ],
  // 7 — Pizza Paradiso
  [
    { name: 'Margherita',       category: 'Піца',    price: 159, emoji: '🍕', desc: 'San Marzano tomato, fior di latte, fresh basil' },
    { name: 'Pepperoni',        category: 'Піца',    price: 179, emoji: '🔴', desc: 'Loaded pepperoni, mozzarella, oregano' },
    { name: 'Quattro Formaggi', category: 'Піца',    price: 189, emoji: '🧀', desc: 'Mozzarella, gorgonzola, parmesan, taleggio' },
    { name: 'Garlic Knots',     category: 'Закуски', price: 69,  emoji: '🧄', desc: 'Freshly baked, garlic butter, parsley' },
    { name: 'Cannoli',          category: 'Десерти', price: 75,  emoji: '🍮', desc: 'Crispy shell, sweetened ricotta, pistachios' },
  ],
  // 8 — Smoothie Lab
  [
    { name: 'Green Goddess',   category: 'Смузі',   price: 99,  emoji: '🥬', desc: 'Spinach, banana, almond milk, protein' },
    { name: 'Berry Blast',     category: 'Смузі',   price: 89,  emoji: '🍓', desc: 'Mixed berries, oat milk, chia seeds' },
    { name: 'Mango Tango',     category: 'Смузі',   price: 89,  emoji: '🥭', desc: 'Mango, pineapple, coconut milk, turmeric' },
    { name: 'PB Banana Boost', category: 'Смузі',   price: 109, emoji: '🥜', desc: 'Peanut butter, banana, oat milk, honey, protein powder' },
    { name: 'Energy Shot',     category: 'Додатки', price: 45,  emoji: '⚡', desc: 'Ginger, lemon, cayenne, apple cider vinegar' },
    { name: 'Granola Bar',     category: 'Додатки', price: 49,  emoji: '🍫', desc: 'House-made oat granola bar, dark chocolate' },
  ],
];

const PROMOS_DATA = [
  { tag: 'Новачкам',    title: 'Знижка 10% на перше замовлення', desc: 'Діє для нових користувачів на будь-яке замовлення від ₴150.', code: 'WELCOME10', discount: 0.10, type: 'percent', minOrder: 150, expiry: '2025-12-31', banner: 'green', emoji: '🌿', active: true },
  { tag: 'Сезонне',     title: '₴50 знижки на українську кухню',  desc: 'Замовляй у Хаті з борщем, Вареничній або Шинку — отримай знижку ₴50.', code: 'UKRAINE50', discount: 50, type: 'fixed', minOrder: 200, expiry: '2025-08-31', banner: 'brown', emoji: '🇺🇦', active: true },
  { tag: 'Доставка',    title: 'Безкоштовна доставка', desc: 'Скасовує сервісний збір ₴49 на замовлення від ₴300.', code: 'FREESHIP', discount: 49, type: 'fixed', minOrder: 300, expiry: '2025-07-15', banner: 'olive', emoji: '🚴', active: true },
  { tag: 'Нічна акція', title: '20% після 21:00', desc: 'Замовляй пізно — отримуй більше. Знижка активна з 21:00 до 00:00.', code: 'NIGHT20', discount: 0.20, type: 'percent', minOrder: 100, expiry: '2025-09-30', banner: 'dark', emoji: '🌙', active: true },
  { tag: 'Літо',        title: '15% на смузі та здорове', desc: 'Знижка на всі замовлення з Smoothie Lab у червні та липні.', code: 'SUMMER15', discount: 0.15, type: 'percent', minOrder: 80, expiry: '2025-07-31', banner: 'green', emoji: '☀️', active: true },
  { tag: 'Знайомство',  title: '₴30 на перший азійський заклад', desc: 'Перше замовлення у Sakura Ramen або Dragon Wok — мінус ₴30.', code: 'TRYIT', discount: 30, type: 'fixed', minOrder: 120, expiry: '2025-10-31', banner: 'brown', emoji: '🥢', active: true },
];

async function seed() {
  await mongoose.connect(URI);
  console.log('✅ Connected to MongoDB');

  await Shop.deleteMany({});
  await Product.deleteMany({});
  await Promo.deleteMany({});

  const shops = await Shop.insertMany(SHOPS_DATA);
  console.log(`✅ Inserted ${shops.length} shops`);

  let productCount = 0;
  for (let i = 0; i < shops.length; i++) {
    const shopProds = PRODUCTS_DATA[i].map((p) => ({ ...p, shopId: shops[i]._id }));
    await Product.insertMany(shopProds);
    productCount += shopProds.length;
  }
  console.log(`✅ Inserted ${productCount} products`);

  await Promo.insertMany(PROMOS_DATA);
  console.log(`✅ Inserted ${PROMOS_DATA.length} promos`);

  await mongoose.disconnect();
  console.log('🎉 Seed complete!');
}

seed().catch((e) => { console.error(e); process.exit(1); });
