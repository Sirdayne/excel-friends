<template lang="pug">
#main-page
  #forms
    #form-menu
      p(style="margin: 5px 5px 20px;") Добавить элемент меню:
      el-form(label-width="120px")
        el-form-item(label="Наименование")
          el-input(v-model="menuName")
        el-form-item(label="Цена")
          el-input(v-model="menuPrice" type="number")
        el-form-item
          el-button(@click="addMenu") Добавить в меню
    #form-friends
      p(style="margin: 5px 5px 20px;") Добавить друга:
      el-form(label-width="120px")
        el-form-item(label="Имя")
          el-input(v-model="friendName")
        el-form-item
          el-button(@click="addFriend") Добавить в таблицу

  .container(v-if="menu && menu.length > 0")
    .title Еда:
    .menu
      .menu-item(v-for="(item, index) in menu" :key="item.id")
        p(style="margin-bottom: 8px;") {{ index + 1 }} позиция
          el-button.btn-remove(@click="removeMenu(item.id)" size="mini") удалить
        el-input(v-model="item.name")
        el-input(v-model="item.price" type="number")

  .container(v-if="friends && friends.length > 0")
    .title Попали в эксельку:
    .friends
      .friend(v-for="(item, index) in friends" :key="item.id")
        p(style="margin-bottom: 8px;") {{ index + 1 }} друг
          el-button.btn-remove(@click="removeFriend(item.id)" size="mini") удалить
        el-input(v-model="item.name")

  .table-container#table
    .table(v-if="menu && menu.length > 0 && friends && friends.length > 0" :style="{ width: getTableWidth + 'px'}")
      .table-row.table-row_title
        .table-cell Наименование | Цена
        .table-cell(v-for="friend in friends" :key="friend.id") {{ friend.name }}
        .table-cell
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
        .table-cell
      .table-row
        .table-cell Итого
        .table-cell(v-for="friend in friends" :key="friend.id") {{ getSum(friend.menus) | noInfinityAndFixed }}
        .table-cell {{ getSumTotal() | noInfinityAndFixed }}
      .table-row
        .table-cell Итого с процентом
          el-input.percent(v-model="percent" type="number" max="100" min="0")
          span %
        .table-cell(v-for="friend in friends" :key="friend.id") {{ getSumPercent(friend.menus) | noInfinityAndFixed }}
        .table-cell {{ getSumTotalPercent() | noInfinityAndFixed }}

  el-dialog(title="Сохранить таблицу?"
            :visible.sync="dialogSave")
    span Вы уверены что хотите перезаписать данные?
    span(slot="footer" class="dialog-footer")
      el-button(@click="dialogSave = false") Отмена
      el-button(type="primary" @click="saveToLocalStorage()") ОК

  el-dialog(title="Сохранить таблицу?"
            :visible.sync="dialogLoad")
    span Вы потеряете текущие значения в таблице.
    span(slot="footer" class="dialog-footer")
      el-button(@click="dialogLoad = false") Отмена
      el-button(type="primary" @click="loadFromLocalStorage()") ОК

  .controls
    el-button(@click="dialogSave = true") Сохранить таблицу
    el-button(@click="dialogLoad = true") Загрузить таблицу
    el-button(@click="saveImage") Сохранить картинку

</template>

<script>

import htmlToImage from 'html-to-image';

export default {
  name: 'MainPage',
  data() {
    return {
      menuName: '',
      menuPrice: 0,
      friendName: '',
      menu: [],
      friends: [],
      percent: 10,
      dialogSave: false,
      dialogLoad: false
    }
  },
  computed: {
    getTableWidth() {
      return this.friends.length * 200 + 200;
    }
  },
  methods: {
    addMenu() {
      if (this.menuName && this.menuPrice) {
        const menuItem = {
          id: Date.now(),
          name: this.menuName,
          price: this.menuPrice
        }
        this.menu.push(menuItem)
        this.menuName = ''
        this.menuPrice = 0
      } else {
        this.$message({
          message: 'Заполните наименование и цену!',
          type: 'warning'
        });
      }
    },
    addFriend() {
      if (this.friendName) {
        const friendItem = {
          id: Date.now(),
          name: this.friendName,
          menus: []
        }
        this.friends.push(friendItem)
        this.friendName = ''
      } else {
        this.$message({
          message: 'Заполните имя!',
          type: 'warning'
        });
      }
    },
    removeMenu(menuId) {
      this.menu = this.menu.filter(item => item.id !== menuId)
    },
    removeFriend(friendId) {
      this.friends = this.friends.filter(item => item.id !== friendId)
    },
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
    },
    saveToLocalStorage() {
      if (this.friends.length > 0 && this.menu.length > 0) {
        localStorage.setItem('friends', JSON.stringify(this.friends))
        localStorage.setItem('menu', JSON.stringify(this.menu))
        localStorage.setItem('percent', this.percent)
      } else {
        this.$message({
          message: 'Таблица пуста!',
          type: 'warning'
        });
      }
      this.dialogSave = false
    },
    loadFromLocalStorage() {
      this.friends = JSON.parse(localStorage.getItem('friends')) || [];
      this.menu = JSON.parse(localStorage.getItem('menu')) || [];
      this.percent = localStorage.getItem('percent') || 10;
      this.dialogLoad = false
    },
    saveImage() {
      if (this.friends.length > 0 && this.menu.length > 0) {
        const width = window.innerWidth > this.getTableWidth ? window.innerWidth : this.getTableWidth
        htmlToImage.toPng(document.getElementById('table'), { width })
          .then((dataUrl) => {
            let link = document.createElement('a');
            link.download = 'excelka.png';
            link.href = dataUrl;
            link.click();
          });
      } else {
        this.$message({
          message: 'Таблица пуста!',
          type: 'warning'
        });
      }
    }
  }
}
</script>
