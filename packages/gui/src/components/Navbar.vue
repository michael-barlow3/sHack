<template>
    <mdb-navbar class="flexible-navbar" position="top">
      <h1>VistA Audit Solution</h1>
      <h2>Audit Query And Retrieval Application</h2>
  </mdb-navbar>
</template>

<script>

import { mdbNavbar, mdbNavbarBrand, mdbNavbarNav, mdbIcon } from 'mdbvue'
export default {
  name: 'Navbar',
  props: {
    page: {
      type: String
    }
  },

  components: {
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavbarNav,
    mdbIcon
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 { text-align: center; }

.navbar {
  display:block;
}

.flexible-navbar {
  margin-left: 240px;
}

.deep-purple-skin .navbar {
  background-color: #372e5f!important;
}

.navbar .nav-item {
  line-height: 24px;
  font-size: 16px;
}

.navbar ul {
  padding: 5px 0;
}

.navbar .btn {
  font-weight: 300;
}

.navbar-collapse {
  order: 0 !important;
}

.navbar .notifications-nav .dropdown-menu {
  width: 23rem; }

.navbar-expand-lg .navbar-nav {
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-direction: row;
}

.btn-transparent {
  background-color: transparent !important;
  color: #000;
  text-transform: none;
  box-shadow: none !important;
}

.btn-transparent:hover, .btn-transparent:active {
  box-shadow: none !important;
}

</style>
