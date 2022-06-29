  import { defineComponent, PropType, ref, computed, watch, onMounted } from 'vue'
  import { playerStore, Lyric } from '@/store/modules/player'
  export default defineComponent({
    props: {
      //手动改变的时间
      resetTime: {
        type: Number as PropType<Number>,
        default: 0
      }
    },
    setup () {
      const ratio = document.documentElement.clientWidth / 1280
      const lyrics = computed<Lyric[]>(() => playerStore.lyrics)
      const ulRef = ref<HTMLUListElement | null>(null)
      // 歌词行高
      const OFFSET = 40 * ratio
      // 基准线
      const CPOS = 4

      const lineHeight = () => {
        const lis = ulRef.value.querySelectorAll('li')
        const lineNo = playerStore.currentLineNo - 1
        if (lineNo < 0) return
        if (lineNo > 0) {
          lis[lineNo - 1].removeAttribute('class')
        }
        lis[lineNo].className = 'active'
        if (lineNo > CPOS) {
          ulRef.value.scrollTop = Number((lineNo-CPOS) * OFFSET)
        }
      }

      watch(() => playerStore.currentLineNo, (newVal: number, oldVal: number) => {
        if (!ulRef.value) return
        //如果是 0 的话就重置，不然可能会保存上一次的效果
        if (playerStore.currentLineNo === 0 || newVal <= oldVal) {
          const lis = ulRef.value.querySelectorAll('li')
          lis.forEach((li: HTMLElement) => {
            li.removeAttribute('class')
          })
          ulRef.value.scrollTop = 0
          return
        }
        lineHeight()
      })

      onMounted(() => {
        lineHeight()
      })
      // 渲染热搜列表
      const renderLyric = () => {
        return lyrics.value.map((lyric, i) => {
          return <li key={'lyric' + i} data-time={lyric.time}>
            {lyric.text}
          </li>
        })
      }

      return () => {
        <ul ref={ulRef} class="lyrics">
          { renderLyric() }
        </ul>
      }
    }
  })
