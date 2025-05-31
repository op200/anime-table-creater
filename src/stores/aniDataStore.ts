import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

import type { AniItem, AniSubjects } from '@/api'
import { localStore } from '@/utils'

export const useAniDataStore = defineStore('aniData', () => {

  const aniItemList = ref<AniItem[]>([])
  localStore.setStore(aniItemList, "aniItemList")


  const aniYearGroups = ref<AniItem[][]>([])
  watch(aniItemList, () => {
    aniYearGroups.value = []

    if (aniItemList.value.length) {
      let year = (new Date(0)).getFullYear()

      aniItemList.value.forEach(v => {
        const new_year = (new Date(v.date)).getFullYear()
        if (new_year === year) {
          aniYearGroups.value[aniYearGroups.value.length - 1].push(v)
        }
        else {
          year = new_year
          aniYearGroups.value.push([v])
        }
      })
    }
  }, { deep: true })


  return { aniItemList, aniYearGroups }
})
