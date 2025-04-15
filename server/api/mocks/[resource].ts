import { PetType, AgeGroup, FoodType, MeatType } from '~/types/products'

export default defineEventHandler((event) => {
  const resource = event.context.params?.resource

  const mockData = {
    products: [
      {
        id: 1,
        name: "Royal Canin Maxi Adult",
        image: '1',
        price: 3200,
        description: "Сухой корм для взрослых собак крупных пород с курицей",
        petType: PetType.DOG,
        meatType: MeatType.CHICKEN,
        ageGroup: AgeGroup.ADULT,
        foodType: FoodType.DRY,
        packageSize: { value: 15, unit: 'kg' },
        features: ["Поддержка иммунитета", "Здоровье суставов", "Легкое пищеварение"],
        rating: 4.8
      },
      {
        id: 2,
        name: "Hill's Science Plan Kitten",
        image: '2',
        price: 1800,
        description: "Сухой корм для котят с курицей для здорового роста и развития",
        petType: PetType.CAT,
        meatType: MeatType.CHICKEN,
        ageGroup: AgeGroup.KITTEN,
        foodType: FoodType.DRY,
        packageSize: { value: 2, unit: 'kg' },
        features: ["Поддержка иммунитета", "Развитие мозга", "Здоровье пищеварения"],
        rating: 4.7
      },
      {
        id: 3,
        name: "Purina Pro Plan Sensitive",
        image: '3',
        price: 2800,
        description: "Сухой корм для собак с чувствительным пищеварением с лососем",
        petType: PetType.DOG,
        meatType: MeatType.FISH,
        ageGroup: AgeGroup.ADULT,
        foodType: FoodType.DRY,
        packageSize: { value: 7, unit: 'kg' },
        features: ["Для чувствительного пищеварения", "Без пшеницы", "Омега-3 и омега-6"],
        rating: 4.6
      },
      {
        id: 4,
        name: "Acana Wild Prairie Cat",
        image: '1',
        price: 3500,
        description: "Беззерновой корм для кошек всех возрастов с курицей и индейкой",
        petType: PetType.CAT,
        meatType: MeatType.TURKEY,
        ageGroup: AgeGroup.ADULT,
        foodType: FoodType.DRY,
        packageSize: { value: 4.5, unit: 'kg' },
        features: ["Беззерновой", "Высокое содержание белка", "Натуральные ингредиенты"],
        rating: 4.9
      },
      {
        id: 5,
        name: "Royal Canin Mini Senior",
        image: '2',
        price: 1900,
        description: "Сухой корм для пожилых собак мелких пород",
        petType: PetType.DOG,
        meatType: MeatType.CHICKEN,
        ageGroup: AgeGroup.SENIOR,
        foodType: FoodType.DRY,
        packageSize: { value: 3, unit: 'kg' },
        features: ["Поддержка жизненных сил", "Здоровье зубов", "Поддержка почек"],
        rating: 4.5
      },
      {
        id: 6,
        name: "Grandorf 4 Meat & Brown Rice",
        image: '3',
        price: 4200,
        description: "Сухой корм для взрослых собак всех пород с 4 видами мяса и бурым рисом",
        petType: PetType.DOG,
        meatType: MeatType.BEEF,
        ageGroup: AgeGroup.ADULT,
        foodType: FoodType.DRY,
        packageSize: { value: 12, unit: 'kg' },
        features: ["4 вида мяса", "Гипоаллергенный", "Натуральные ингредиенты"],
        rating: 4.7
      },
      {
        id: 7,
        name: "Farmina N&D Pumpkin Lamb",
        image: '1',
        price: 3800,
        description: "Беззерновой корм для собак с ягненком и тыквой",
        petType: PetType.DOG,
        meatType: MeatType.LAMB,
        ageGroup: AgeGroup.ADULT,
        foodType: FoodType.DRY,
        packageSize: { value: 7, unit: 'kg' },
        features: ["Беззерновой", "С тыквой", "Для чувствительного пищеварения"],
        rating: 4.8
      },
      {
        id: 8,
        name: "Purina ONE Sterilized",
        image: '2',
        price: 1600,
        description: "Сухой корм для стерилизованных кошек и кастрированных котов с курицей",
        petType: PetType.CAT,
        meatType: MeatType.CHICKEN,
        ageGroup: AgeGroup.ADULT,
        foodType: FoodType.DRY,
        packageSize: { value: 3, unit: 'kg' },
        features: ["Контроль веса", "Здоровье мочевыводящих путей", "Здоровая кожа и шерсть"],
        rating: 4.5
      },
      {
        id: 9,
        name: "Sheba Pleasure",
        image: '3',
        price: 85,
        description: "Влажный корм для кошек с курицей и индейкой в соусе",
        petType: PetType.CAT,
        meatType: MeatType.CHICKEN,
        ageGroup: AgeGroup.ADULT,
        foodType: FoodType.WET,
        packageSize: { value: 85, unit: 'g' },
        features: ["Порционные пакетики", "В соусе", "Нежные кусочки"],
        rating: 4.4
      },
      {
        id: 10,
        name: "Pedigree Vital Protection",
        image: '1',
        price: 120,
        description: "Влажный корм для собак с говядиной и ягненком в желе",
        petType: PetType.DOG,
        meatType: MeatType.BEEF,
        ageGroup: AgeGroup.ADULT,
        foodType: FoodType.WET,
        packageSize: { value: 100, unit: 'g' },
        features: ["В желе", "Сбалансированный состав", "Удобная упаковка"],
        rating: 4.2
      },
      {
        id: 11,
        name: "Versele-Laga Nature Fibrefood",
        image: '2',
        price: 950,
        description: "Корм для кроликов с повышенным содержанием клетчатки",
        petType: PetType.RODENT,
        meatType: MeatType.VEGETARIAN,
        ageGroup: AgeGroup.ADULT,
        foodType: FoodType.DRY,
        packageSize: { value: 1, unit: 'kg' },
        features: ["Высокое содержание клетчатки", "С травами", "Для здоровья зубов"],
        rating: 4.6
      },
      {
        id: 12,
        name: "Tetra Goldfish",
        image: '3',
        price: 350,
        description: "Хлопьевидный корм для золотых рыбок",
        petType: PetType.FISH,
        meatType: MeatType.VEGETARIAN,
        ageGroup: AgeGroup.ADULT,
        foodType: FoodType.DRY,
        packageSize: { value: 250, unit: 'g' },
        features: ["Для яркой окраски", "Легко усваивается", "Не мутит воду"],
        rating: 4.5
      }
    ],
  }

  return mockData[resource as keyof typeof mockData] || { error: "Ресурс не найден" }
})