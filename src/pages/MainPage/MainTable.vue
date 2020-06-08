<template lang="pug">
.table-container#table
  .table(v-if="menu && menu.length > 0 && friends && friends.length > 0" :style="{ width: getTableWidth + 'px'}")
    .table-row.table-row_main
      .table-cell CheckPlz
    .table-row.table-row_title
      .table-cell Позиция | Цена
      .table-cell(v-for="friend in friends" :key="friend.id") {{ friend.name }}
      .table-cell Позиция | Цена
    .table-row(v-for="row in menu" :key="row.id")
      .table-cell {{ row.name }} | {{ row.price}}
      .table-cell.cursor-pointer(
        v-for="friend in friends"
        :key="friend.id"
        @click="updateFriendMenu(friend, row.id)"
        :class="isMenuInFriend(friend, row.id) ? 'check-yes' : 'check-no'"
        )
        span {{ isMenuInFriend(friend, row.id) ? 'Да' : 'Нет' }}
        span(style="margin-left: 10px;") {{ isMenuInFriend(friend, row.id) ? getDividedPrice(row.price, row.id) : 0 | noInfinityAndFixed }}
      .table-cell {{ row.name }} | {{ row.price}}
    .table-row
      .table-cell Итого
      .table-cell(v-for="friend in friends" :key="friend.id") {{ getSum(friend.menus) | noInfinityAndFixed }}
      .table-cell {{ getSumTotal() | noInfinityAndFixed }}
    .table-row
      .table-cell Итого с процентом
        el-input.percent(v-model="percent" type="number" max="100" min="0" placeholder="Percent")
        span %
      .table-cell(v-for="friend in friends" :key="friend.id") {{ getSumPercent(friend.menus) | noInfinityAndFixed }}
      .table-cell {{ getSumTotalPercent() | noInfinityAndFixed }}
</template>

<script>

export default {
  props: ['menu', 'friends', 'percent', 'getTableWidth'],
  name: 'MainTable',
  data() {
    return {
    }
  },
  created() {
    this.activeControls = this.$route.name === 'Save'
  },
  methods: {
    isMenuInFriend(friend, menuId) {
      return friend.menus.find(menu => menu.id === menuId)
    },
    updateFriendMenu(friend, menuId) {
      const foundMenu = friend.menus.find(item => item.id === menuId)
      if (foundMenu) {
        friend.menus = friend.menus.filter(item => item.id !== menuId)
      } else {
        const menu = this.menu.find(item => item.id === menuId)
        friend.menus.push(menu)
      }
    },
    getDividedPrice(menuPrice, menuId) {
      return parseInt(menuPrice) / this.getNumOfFriendsEatThis(menuId)
    },
    getSum(menus) {
      return menus.reduce((sum, menu) => sum + parseInt(menu.price) / this.getNumOfFriendsEatThis(menu.id), 0)
    },
    getNumOfFriendsEatThis(menuId) {
      let count = 0;
      this.friends.forEach(friend => {
        count = friend.menus.find(menu => menu.id === menuId) ? count + 1 : count;
      })
      return count
    },
    getSumPercent(menus) {
      const sum = this.getSum(menus);
      return sum + sum * this.percent  / 100
    },
    getSumTotal() {
      return this.menu.reduce((sum, menu) => sum + parseInt(menu.price), 0)
    },
    getSumTotalPercent() {
      const sum = this.getSumTotal();
      return sum + sum * this.percent  / 100
    }
  }
}
</script>
