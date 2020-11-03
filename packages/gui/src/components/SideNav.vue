<template>
  <div class="deep-purple-skin">
    <!-- mdb-side-nav = MQARISideNav component has all selection fields -->
    <mdb-side-nav
      :breakWidth=770
      :OpenedFromOutside.sync="toggle"
      :logo="'/assets/department-of-veterans-affairs-logo.svg'"
      :logoAlt="'Logo for the Department of Veterans Affairs'"
      :PatientLookupResults="PatientLookupResults"

      mask="strong"
      logoSn
      sideNavClass="sn-bg-4"
      ref="sideNav"
      fixed>

      <li>
        <mdb-side-nav-nav>
          <li>

            <div class="text-center">
              <mdb-btn class="SelectPatient" color="secondary" rounded ref="SelectPatientBtn" @click="SelectPatient" >Enter Patient Info</mdb-btn>
            </div>

            <div v-if="Patient.p" class="form-group" @click="wave">
              <div class="text-center">Patient</div>
              <div>Name: <span class="em">{{Patient.p}}</span></div>
              <div>DOB: <span class="em">{{Patient.d}}</span></div>
              <div>SSN: <span class="em">{{Patient.s}}</span></div>
              <br>

              <form>
                  <label for="SelectedUserInput" v-if="vmUsers.length > 0">User</label>
                  <v-select id="user" :options="vmUsers" :clearable=false :placeholder="SelecUser" :inputId="inputId" @input="UserSelected"></v-select>
              </form>
            </div>
        </li>
        </mdb-side-nav-nav>
      </li>

    </mdb-side-nav>
  </div>
</template>

<script>
import {eventBus} from "../main";
import { mdbBtn, mdbInput, mdbSelect, mdbContainer, mdbSideNavNav, mdbSideNavCat, mdbSideNavItem, mdbIcon, waves } from "mdbvue";
import vSelect from "vue-select";

import mdbSideNav from "./components/MQARISideNav"


export default {
  name: "SideNav",

  props: {
    PatientLookupResults: "",
    waves: {
      type: Boolean,
      default: true
    }
  },

  components: {
    mdbBtn,
    mdbInput,
    mdbContainer,
    mdbSelect,
    mdbSideNav,
    mdbSideNavNav,
    mdbSideNavCat,
    mdbSideNavItem,
    mdbIcon,
    waves,
    vSelect
  },

  data () {
    return {
      toggle: false,
      active: 0,
      elHeight: 0,
      windowHeight: 0,

      Patient: "",

      User: {name: "", duz: ""},
      UserList: "",

      mdSelectedDate: "",
      mdqDateValue: "",
      mdqDateField: "",
      Users: [],
      inputId: "SelectedUserInput",
      options: [],
      SelecUser: "Select User"
    }
  },

  computed: {
    vmUsers: function() {
      return this.Users
    }
  },

  mounted() {
    let vm = this; // We need the local scope at mount time not at execute time

    eventBus.$on("mdbSelectPatient-Data", function(LUResult) {
      // console.log("SideNAV received mdbSelectPatient-Data event - ", LUResult.data)
      // let selUser = document.getElementsByClassName("vs__selected");
      // if (selUser[0] && selUser[0].innerText) {
      //   console.log("clear selected");
      //   selUser[0].innerText = "";
      // }

      this.Users = [""];


      if (LUResult.state) {
        // let selUser = document.getElementsByClassName("vs__selected");
        // if (selUser[0] && selUser[0].innerText) {
        //   console.log("clear selected");
        //   selUser[0].innerText = "";
        // }
        // selUser = document.getElementById("SelectedUserInput");
        // if (selUser && selUser.value) {
        //   selUser.value = "";
        // }


        vm.Patient = LUResult.data;
        console.log("vm.Patient = ", vm.Patient);
        // vm.PatientLookupResults = LUResult.data;
        // vm.mdSelectedUser = "";
        // const UsersList = LUResult.data.u[0].map(function(el) {
        const UsersList = LUResult.data.u.map(function(el) {
          return { label: el, text: el, value: el }
        })

        UsersList.sort(function (a, b) {
          // Use toUpperCase() to ignore character casing
          const textA = a.text.toUpperCase();
          const textB = b.text.toUpperCase();

          let comparison = 0;
          if (textA > textB) {
            comparison = 1;
          } else if (textA < textB) {
            comparison = -1;
          }
          return comparison;
        });


        setTimeout(function() {
          if (vm.$refs.SelectPatientBtn) {
            // console.log("Button should have focus")
            vm.$refs.SelectPatientBtn.$el.focus();
            vm.Users = UsersList;
          }
        }, 50);
      } else {
        console.log("SideNav - mdbSelectPatient-Data: ERROR - ", LUResult.data)
        vm.Users = [];
        eventBus.$emit("mdqp-list", { status: "Error", msg: LUResult.data });
      }
    });
  },

  methods: {
    UserSelected: function(el) {
      if (el) {
        eventBus.$emit("SelectedUser", el.value);
      }
    },

    SelectPatient: function() {
      eventBus.$emit("show-select-patient", true);
    },
  },
  mixins: [ waves ]
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.side-nav .form-group {
  margin: 0 .75em;
  font-size: 0.95em;
  color: white;
  font-weight: bold;
}

.side-nav .form-group label {
  width:100%;
  margin-bottom: 0;
  text-align:center;
}

.side-nav div  {
  font-weight: bold;
}

.side-nav div span.em {
  font-weight: normal;
}

.sn-bg-4 {
  background-image: url("https://www.ntstrucking.com/wp-content/uploads/2018/07/sidebar-background.jpg");
}

/* Vue Select Styles */
.side-nav .form-group >>> .vs__open-indicator {
  fill:white!important;
}

.side-nav .form-group >>> .vs__selected, .side-nav .form-group >>> .vs__selected-options input {
  color: white!important;
}

.side-nav .form-group >>> .vs__selected-options {
  flex-wrap: nowrap;
  font-size: smaller;
}

.side-nav .form-group >>> .vs__dropdown-menu {
  margin: 0 20px 0 15px;
  width: 210px;
}

.side-nav .form-group >>> .vs__dropdown-menu li {
  font-size:smaller;
}

.side-nav .form-group >>> .vs__dropdown-toggle {
  border: 1px solid rgba(255,255,255,.26);

}

.side-nav .form-group >>> .vs__dropdown-option--highlight {
  background: silver;
  color: navy;
}

.deep-purple-skin .SelectPatient.btn-secondary:focus,
.deep-purple-skin .SelectPatient.btn-secondary:hover,
.v-select:focus, .v-select:hover, .v-select:active, .v-select:focus-within {
  color:rgb(210,243,31);
  box-shadow: 0 5px 15px 0 rgba(200,200,250,0.10), 0 4px 15px 0 rgba(200,200,250,1);
}


</style>
