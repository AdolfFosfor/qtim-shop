<template>
  <div class="flex justify-center mt-8 space-x-2">
    <button
      class="px-4 py-2 rounded-md border transition"
      :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
      aria-label="Предыдущая страница"
    >
      <Icon name="uil:angle-left" />
    </button>
    
    <template v-for="page in displayedPages" :key="page">
      <span
        v-if="page === '...'"
        class="px-4 py-2 text-gray-700"
      >
        ...
      </span>
      <button
        v-else
        class="px-4 py-2 rounded-md border transition"
        :class="currentPage === page ? 'bg-main text-white border-main' : 'bg-white text-gray-700 hover:bg-gray-50'"
        @click="changePage(Number(page))"
      >
        {{ page }}
      </button>
    </template>
    
    <button
      class="px-4 py-2 rounded-md border transition"
      :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
      aria-label="Следующая страница"
    >
      <Icon name="uil:angle-right" />
    </button>
  </div>
</template>

<script setup lang="ts">
// Пропсы для компонента пагинации
const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

// Эмиты для внешних компонентов
const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();

// Функция смены страницы
const changePage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page);
  }
};

// Вычисляем страницы для отображения с учетом эллипсисов
const displayedPages = computed(() => {
  const result: (number | string)[] = [];
  const totalPages = props.totalPages;
  const currentPage = props.currentPage;
  
  // Если меньше 8 страниц, показываем все
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      result.push(i);
    }
  } else {
    // Всегда показываем первую страницу
    result.push(1);
    
    // Определяем начальную и конечную страницы для отображения
    let startPage: number, endPage: number;
    
    if (currentPage <= 3) {
      // Если текущая страница близка к началу
      startPage = 2;
      endPage = 5;
      result.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
      result.push('...');
      result.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Если текущая страница близка к концу
      result.push('...');
      startPage = totalPages - 4;
      endPage = totalPages;
      result.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
    } else {
      // Если текущая страница в середине
      result.push('...');
      startPage = currentPage - 1;
      endPage = currentPage + 1;
      result.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
      result.push('...');
      result.push(totalPages);
    }
  }
  
  return result;
});
</script>
