// Тип животного
export enum PetType {
    DOG = 'dog',
    CAT = 'cat',
    BIRD = 'bird',
    FISH = 'fish',
    RODENT = 'rodent'
}

// Тип мяса/основного ингредиента
export enum MeatType {
    CHICKEN = 'chicken',
    BEEF = 'beef',
    FISH = 'fish',
    LAMB = 'lamb',
    TURKEY = 'turkey',
    VEGETARIAN = 'vegetarian',
    GRAIN_FREE = 'grain_free'
}

// Возрастная группа
export enum AgeGroup {
    PUPPY = 'puppy',
    KITTEN = 'kitten',
    ADULT = 'adult',
    SENIOR = 'senior',
    ALL_AGES = 'all_ages'
}

// Тип корма
export enum FoodType {
    DRY = 'dry',
    WET = 'wet',
    SEMI_WET = 'semi_wet',
    TREATS = 'treats',
    SUPPLEMENTS = 'supplements'
}

// Размер упаковки
export interface PackageSize {
    value: number; // значение
    unit: 'g' | 'kg'; // единица измерения (граммы или килограммы)
}

// Расширенный интерфейс продукта
export interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    description: string; // краткое описание
    petType: PetType; // тип животного
    meatType: MeatType; // тип мяса/основной ингредиент
    ageGroup: AgeGroup; // возрастная группа
    foodType: FoodType; // тип корма
    packageSize: PackageSize; // размер упаковки
    features?: string[]; // дополнительные свойства (например, гипоаллергенный, без консервантов и т.д.)
    rating?: number; // рейтинг продукта (1-5)
}

// Интерфейс для продукта в корзине
export interface CartProduct extends Product {
    count: number; // количество в корзине
}

// Интерфейс для фильтров
export interface ProductFilters {
    petType?: PetType[];
    meatType?: MeatType[];
    ageGroup?: AgeGroup[];
    foodType?: FoodType[];
    priceRange?: {
        min: number;
        max: number;
    };
    features?: string[];
}