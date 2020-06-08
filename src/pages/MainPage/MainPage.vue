<template lang="pug">
#main-page

  el-dialog(title="Сохранить таблицу?"
  :visible.sync="dialogSave")
    span Вы уверены что хотите перезаписать данные?
    span(slot="footer" class="dialog-footer")
      el-button(@click="dialogSave = false") Отмена
      el-button(type="primary" @click="saveToLocalStorage()") ОК

  el-dialog(title="Загрузить таблицу?"
  :visible.sync="dialogLoad")
    span Вы потеряете текущие значения в таблице.
    span(slot="footer" class="dialog-footer")
      el-button(@click="dialogLoad = false") Отмена
      el-button(type="primary" @click="loadFromLocalStorage()") ОК

  .page-container
    #forms
      #form-menu
        p.sub-title Добавить элемент меню:
        el-form(label-width="120px" label-position="top")
          el-form-item
            el-input(v-model="menuName" placeholder="Наименование")
          el-form-item
            el-input(v-model="menuPrice" type="number" placeholder="Цена")
          el-form-item
            el-button(@click="addMenu") Добавить в меню
      #form-friends
        p.sub-title Добавить друга:
        el-form(label-width="120px" label-position="top")
          el-form-item
            el-input(v-model="friendName" placeholder="Имя")
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

    main-table(:menu="menu" :friends="friends" :percent="percent" :get-table-width="getTableWidth")

    .controls
      el-button(@click="dialogSave = true" v-if="activeControls") Сохранить таблицу
      el-button(@click="dialogLoad = true" v-if="activeControls") Загрузить таблицу
      el-button(@click="saveImage" :loading="loading") Сохранить картинку

</template>

<script>

import htmlToImage from 'html-to-image';
import MainTable from './MainTable';

export default {
  name: 'MainPage',
  components: {
    MainTable
  },
  data() {
    return {
      menuName: '',
      menuPrice: '',
      friendName: '',
      menu: [],
      friends: [],
      percent: 10,
      dialogSave: false,
      dialogLoad: false,
      loading: false,
      activeControls: false
    }
  },
  computed: {
    getTableWidth() {
      return this.friends.length * 200 + 200;
    }
  },
  created() {
    this.activeControls = this.$route.name === 'Save'
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
        this.menuPrice = ''
      } else {
        this.$message({
          message: 'Заполните наименование и цену',
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
          message: 'Заполните имя',
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
    saveToLocalStorage() {
      if (this.friends.length > 0 && this.menu.length > 0) {
        localStorage.setItem('friends', JSON.stringify(this.friends))
        localStorage.setItem('menu', JSON.stringify(this.menu))
        localStorage.setItem('percent', this.percent)
      } else {
        this.$message({
          message: 'Таблица пуста',
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
        this.loading = true
        const width = window.innerWidth > this.getTableWidth ? window.innerWidth : this.getTableWidth
        htmlToImage.toPng(document.getElementById('table'), { width })
          .then((dataUrl) => {
            let link = document.createElement('a');
            link.download = 'checkplz.png';
            link.href = dataUrl;
            link.click();
          }).finally(() => this.loading = false);
      } else {
        this.$message({
          message: 'Таблица пуста',
          type: 'warning'
        });
      }
    }
  }
}
</script>
