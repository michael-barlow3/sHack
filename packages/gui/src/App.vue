<template>
  <div id='app'>
    <navbar/>
    <side-nav role='navigation' aria-label='Query' />

    <div class='flexible-content'>
      <!--MainContent-->
      <!-- The "router-view" information gets passed to the home.vue component -->
      <main>
        <div>
          <router-view
            :mdHomeTitle='HomeTitle'
            :mdPatientQuery='mdPatientQuery'
            :mdUserQuery='mdUserQuery'
            :mdSelectedPatient='mdSelectedPatient'
            :mdSelectedUser='mdSelectedUser'
            :PatientLookupResults='PatientLookupResults'
            ></router-view>
        </div>
      </main>
      <!--/MainContent -->
    </div>

  </div>
</template>

<script>
import {eventBus, spinner} from "./main";
import SideNav from './components/SideNav'
import Navbar from './components/Navbar'

export default {
  name: 'App',
  components: {
    SideNav,
    Navbar
  },
  data () {
    return {
      mdPatientQuery: '',
      mdSelectedPatient: {},

      mdUserQuery: '',
      mdSelectedUser: {},

      HomeTitle: '',
      PatientLookupResults: ''
    }
  },
  mounted () {
    let vm = this; // We need the local scope at mount time not at execute time
    spinner.src = "/assets/spinner-yokratom.gif";

    eventBus.$on("mdbSelectPatient-Data", function (value) {
      // Data recieved from mdbSelectPatient component
      // that is now passed down to the SideNav (aka side-nav) component via the props at the top ^^
      if (value.state) {
        // console.log("App received mdbSelectPatient-Data event - ", value.data)
        vm.PatientLookupResults = value.data;
        vm.mdSelectedUser = "";
      }
    })
  }
}
</script>


<style>

.deep-purple-skin .btn-secondary:focus,
.deep-purple-skin .btn-secondary:hover {
  color:#d2f31f;
  font-weight: bold;
  box-shadow: 0 5px 15px 0 rgba(200,200,250,0.10), 0 4px 15px 0 rgba(200,200,250,1);
}

.select-active {
  color:rgb(210,243,31);
  box-shadow: 0 5px 15px 0 rgba(200,200,250,0.10), 0 4px 15px 0 rgba(200,200,250,1);
}




html {
  font-size: 16px;
  width: 100%;
}

body {
  font-weight: 300;
  background-color: #eee;
}

caption {
  font-weight: bold;
}

main {
  min-height: 90vh;
  margin-left:240px!important;
  margin-right:2%!important;
  padding-left:0!important;
  text-align:center;
  padding-top: 9rem!important;
}

.side-nav .logo-sn {
  padding-bottom: 1rem;
  padding-top: 1rem;
  border-bottom: 1px solid rgba(153, 153, 153, 0.3);

  height: 150px;
}


.side-nav .logo-sn img {
  width: 120px;
}


.navbar .btn, .navbar .nav-item, .navbar .nav-link {
  padding: 0;
}

.select-wrapper input.select-dropdown {
  font-size: 14px;
}

.form-control {
  font-size: 14px;
  height: calc(2rem + 1px);
  padding: 0.375rem 0.75rem;
}

.cascading-admin-card {
  margin-top: 20px; }
  .cascading-admin-card .admin-up {
    margin-left: 4%;
    margin-right: 4%;
    margin-top: -20px;
  }
  .cascading-admin-card .admin-up .fas, .cascading-admin-card .admin-up .far, .cascading-admin-card .admin-up .fab {
    padding: 1.7rem;
    font-size: 2rem;
    color: #fff;
    text-align: left;
    -webkit-border-radius: 3px;
    border-radius: 3px;
  }
  .cascading-admin-card .admin-up .data {
    float: right;
    margin-top: 2rem;
    text-align: right;
  }
  .cascading-admin-card .admin-up .data p {
    color: #999999;
    font-size: 12px;
  }

.classic-admin-card .card-body {
  color: #fff;
  margin-bottom: 0;
  padding: 0.9rem;
}
.classic-admin-card .card-body p {
  font-size: 13px;
  opacity: 0.7;
  margin-bottom: 0;
}
.classic-admin-card .card-body h4 {
  margin-top: 10px;
}
.classic-admin-card .card-body .float-right .fas, .classic-admin-card .card-body .float-right .far, .classic-admin-card .card-body .float-right .fab {
  font-size: 3rem;
  opacity: 0.5;
}

.table-ui {
  border: 1px solid #e0e0e9;
}

.fullscreen {
  background: #fff;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 100000;
  min-height: 100vh;
}

.fullscreen-view {
  height: 100vh;
}


.list-group .ml-auto {
  float: right;
  flex: none !important;
}

.datepicker-overlay {
  z-index: 9999 !important;
}

@media only screen and (max-width: 1440px) {
  .side-nav.fixed {
    transform: translateX(0) !important;
  }
}

.navbar-brand {
  cursor: pointer
}
</style>
