<template>
  <div class="notice-board">
    <div class="notice-container">
      <ul ref="noticeList">
        <li v-for="(notice, index) in notices" :key="index">
          {{ notice }}
        </li>
        <li v-for="(notice, index) in notices" :key="'copy-' + index">
          {{ notice }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getAnnouncement } from "@/api/game.js";

export default {
  name: 'NoticeBoard',
  data() {
    return {
      notices: []
    };
  },
  mounted() {
    this.startScrolling();
    this.fetchNotices();
  },
  methods: {
    startScrolling() {
      const list = this.$refs.noticeList;
      const totalWidth = list.scrollWidth / 2;
      let scrollPosition = 0;

      const scroll = () => {
        scrollPosition += 1;
        if (scrollPosition >= totalWidth) {
          list.style.transition = 'none';
          scrollPosition = 0;
          list.style.transform = `translateX(-${scrollPosition}px)`;
          requestAnimationFrame(scroll);
          setTimeout(() => {
            list.style.transition = 'transform 0.1s linear';
          }, 0);
        } else {
          list.style.transform = `translateX(-${scrollPosition}px)`;
          requestAnimationFrame(scroll);
        }
      };
      scroll();
    },
    async fetchNotices() {
      try {
        const response = await getAnnouncement();
        const result = response.data
        if (result.code === 0) {
          this.notices = result.data;
        } else {
          console.error("Failed to fetch announcements:", result.msg);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    }
  }
};
</script>

<style scoped>
.notice-board {
  border-radius: 8px;
  width: 100%;
  overflow: hidden;
}
.notice-board h2 {
  margin-bottom: 8px;
}
.notice-container {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  position: relative;
}
.notice-board ul {
  display: flex;
  padding: 0;
  margin: 0;
  list-style: none;
}
.notice-board li {
  display: inline-block;
  margin-right: 16px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>
