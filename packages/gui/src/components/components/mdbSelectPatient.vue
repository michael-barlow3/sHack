<template>
  <VueFocusTrap ref="dialog" @open="open" @gofirst="goFirst" @golast="goLast">
    <section>


      <mdb-modal ref="modal" centered :show="showSelectedPatientDlg" @close="hideSelectPatientDlg()" >
        <mdb-modal-header class="text-center">
          <mdb-modal-title tag="h2" bold class="w-100">Enter Patient Information</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body class="text-right">

          <p class="sr-only">Fields marked with an asterisk are required</p>
          <form id="SelectPatient">
              <input type="text" required style="margin-bottom: 2px; margin-top:8px;" autocomplete="off" v-model="name" ref="InputPatientName" id="name">
              <label for="name">Patient Full Name (Last,First Middle):&nbsp;<span style="font-size: larger; padding: 0 5px 0 0;">*</span><span class="sr-only">Required</span></label>
              <p class="err" v-if="attemptSubmit && missingName">Enter a patients Full Name (Last,First Middle)</p>

              <fieldset>
                <legend>Date of Birth <span style="font-weight:bold">OR</span> Social Security Number are required</legend>
                  <input type="text" style="margin-bottom: 2px; margin-top:1px;" autocomplete="off" maxlength="10" @keypress="isNumberOrSlash($event)" v-model="dob" id="dob" />
                  <label for="dob">Date of Birth (MM/DD/YYYY):&nbsp;</label>
                  <p class="err" v-if="attemptSubmit && missingDoB">Enter Patient"s Date of Birth (MM/DD/YYYY)</p>
                  <hr>
                  <!-- SSN is either a 9 digit number or 10 digits with the last digit being a "P" -->
                  <input type="text" style="margin-bottom: 2px; margin-top:1px;" autocomplete="off" v-model="ssn" id="ssn" maxlength="9" @keypress="isNumber($event)" />
                  <label for="ssn">Social Security Number (#########):&nbsp;</label>
                  <p class="err" v-if="attemptSubmit && missingSsn">Enter Patient"s Social Security Number (no dashes or spaces)</p>
              </fieldset>

              <mdb-btn center type="button" ref="Search"  @click.native="validateForm" color="secondary" rounded>Search for Patient</mdb-btn>
          </form>


        </mdb-modal-body>
      </mdb-modal>


    </section>
  </VueFocusTrap>
</template>


<script>
import {
  eventBus
} from "../../main";

import {
  mdbContainer,
  mdbBtn,
  mdbModalHeader,
  mdbModalBody,
  mdbModalFooter,
  mdbInput,
  mdbModalTitle
} from "mdbvue";

import {
  VueFocusTrap
} from "vue-a11y-utils";

import serviceCalls from "../../serviceCall";
import mdbModal from "./mdbModal";
import axios from "axios";
import _ from "lodash";

const APIBase4P = process.env.VUE_APP_API_BASE;
const httpHeaders = {
  "Accept": "application/json"
};

export default {
  components: {
    mdbContainer,
    mdbBtn,
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbModalFooter,
    mdbInput,
    mdbModalTitle,
    VueFocusTrap
  },
  data() {
    return {
      showSelectedPatientDlg: false,
      attemptSubmit: false,
      name: "",
      dob: "",
      ssn: ""
    };
  },
  computed: {
    missingName: function() {
      return !this.validateName(this.name);
    },
    missingDoB: function() {
      return !this.validateDoB(this.dob);
    },
    missingSsn: function() {
      return !this.validateSsn(this.ssn);
    }
  },
  watch: {
    dob(value) {
      this.validateDoB(value);
    },
    name(value) {
      this.validateName(value);
    },
    ssn(value) {
      this.validateSsn(value);
    }
  },
  mounted() {
    let vm = this; // We need the local scope at mount time not at execute time
    eventBus.$on("show-select-patient", function(message) {
      // Open the Patient Selection dialog
      vm.showSelectedPatientDlg = true;
      vm.attemptSubmit = false;
      vm.name = "";
      vm.dob = "";
      vm.ssn = "";
      setTimeout(function() {
        if (vm.$refs.InputPatientName) {
          const dialog = vm.$refs.dialog;
          if (dialog) {
            dialog.open();
          }
        }
      }, 400);
    });
  },
  methods: {
    hideSelectPatientDlg() {
      // console.log("hideSelectPatientDlg()");
      const dialog = this.$refs.dialog;
      if (dialog) {
        // console.log("Close the dialog");
        dialog.close(true);
      }
      this.showSelectedPatientDlg = false;
    },
    open() {
      let vm = this;
      setTimeout(function() {
        vm.goFirst();
      }, 400);
    },
    goFirst() {
      this.$refs.InputPatientName.focus();
    },
    goLast() {
      this.$refs.Search.focus();
    },
    validateName: function(value) {
      const nameValidator = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
      const safeSearch4 = _.escapeRegExp(value);
      const validName = nameValidator.test(safeSearch4);

      return (validName && value.length >= 5);
    },
    validateDoB: function(value) {
      return this.isValidDate(value);
    },
    validateSsn: function(value) {
      const ssnValidator = /^\d{9}$|^\d{9}P$/;
      const safeSearch4 = _.escapeRegExp(value);
      const validSSN = ssnValidator.test(safeSearch4);
      return (validSSN);
    },
    validateForm: async function(event) {
      let vm = this;
      const haveDob = this.validateDoB(this.dob);
      const haveSsn = this.validateSsn(this.ssn);
      const haveName = this.validateName(this.name);
      const ValidInput = haveName && (haveDob || haveSsn);

      const queryParams = { type: "patient" };


      let queryUri = `${APIBase4P}patient?p=`;
      if (haveName) {
        queryParams.pName = this.name;
        queryUri += this.name;
      }
      if (haveDob) {
        const cDob = this.dob.split("/");
        queryParams.dob = this.dob;
        queryUri = `${queryUri}&d=${cDob[2]}${cDob[0]}${cDob[1]}`;
      }
      if (haveSsn) {
        queryParams.ssn = this.ssn;
        queryUri = `${queryUri}&s=${this.ssn}`;
      }

      if (ValidInput) {
        try {
          const clearSelect = document.getElementsByClassName("vs__clear");
          if (clearSelect.length > 0) {
            clearSelect[0].click(); // Clear the "Select User" input field
          }
          queryUri = serviceCalls.genQuery(queryParams);
          console.log(`mdbSelectPatient - qParams - `, queryParams);
          console.log(`mdbSelectPatient - Query: ${queryUri}\nHeaders: `, httpHeaders);

          eventBus.$emit("wait-for-search", true);
          // vm.showSpinner();
          let theResponse = await axios.get(queryUri, {
            headers: httpHeaders
          }).catch(function (err) {
            vm.hideSpinner();
            throw new Error(`Empty state axios call FAILED - ${err}`);
          });

          // vm.hideSpinner();
          eventBus.$emit("wait-for-search", false);
          console.log("Response from call - ", theResponse);

          if (theResponse.status === 204) {
            console.log("No Data Returned");
            console.log("mdbSelectPatient.vue - mdqp-list - 204")
            console.log("mdbSelectPatient.vue - mdqp-list - No Data - get ", queryUri)
            eventBus.$emit("mdqp-list", {
              status: "No Data",
              msg: {
                name: this.name,
                dob: this.dob,
                ssn: this.ssn
              }
            });
          } else {
            const thePatient = theResponse.data;
            console.log("The Response - Patient ", thePatient);
            console.log("what type - ", typeof thePatient)
            console.log("The Response - Patient DOB ", thePatient.d);

            if (thePatient) {
              const y = thePatient.d.substr(0, 4);
              const m = thePatient.d.substr(4, 2);
              const d = thePatient.d.substr(6, 2);
              const s1 = thePatient.s.substr(0, 3);
              const s2 = thePatient.s.substr(3, 2);
              const s3 = thePatient.s.substr(5, 4);
              thePatient.key = `${thePatient.p}-${thePatient.s}-${thePatient.d}`;
              thePatient.d = `${m}/${d}/${y}`;
              thePatient.s = `${s1}-${s2}-${s3}`;
              console.log("The Patient Return Data - ", thePatient)
              eventBus.$emit("mdqp-list", {
                status: "Patient Search Complete",
                msg: ""
              });
              eventBus.$emit("mdbSelectPatient-Data", {
                state: true,
                data: thePatient
              }) // Send an event (mdbSelectPatient-Data) up to the App component with data.
            } else {
              console.log("No Patient")
            }
          }
        } catch (e) {
          console.log("mdbSelectPatient.vue - mdqp-list - validateForm - Data Retrieval fail ", e);
        }
        this.hideSelectPatientDlg();
      } else {
        console.log("mdbSelectPatient.vue - mdqp-list - validateForm - Name Validation Fail")
        this.attemptSubmit = true;
      }
    },
    isNumber: function($event) {
      if ($event.charCode === 0 || (/\d/).test(String.fromCharCode($event.charCode))) {
        return true
      }
      $event.preventDefault();
    },
    isNumberOrSlash: function($event) {
      if ($event.charCode === 0 || (/\d/).test(String.fromCharCode($event.charCode)) || (/\//).test(String.fromCharCode($event.charCode))) {
        return true
      }
      $event.preventDefault();
    },
    isValidDate: function(value) {
      const inputText = this.dob;
      let dateformat = /^[01][0-9]\/[0123][0-9]\/\d{4}$/;
      if (inputText.length === 10) {
        if (inputText.match(dateformat)) {
          const ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          const opera1 = inputText.split("/");
          const lopera1 = opera1.length;
          let pdate;
          let mm;
          let dd;
          let yy;
          if (lopera1 > 1) {
            pdate = inputText.split("/");
            if (pdate && pdate.length > 2) {
              mm = parseInt(pdate[0]);
              dd = parseInt(pdate[1]);
              yy = parseInt(pdate[2]);
            }
          }
          if (mm === 1 || mm > 2) {
            if (dd > ListofDays[mm - 1]) {
              return false;
            }
          }
          if (mm === 2) {
            let lyear = false;
            if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
              lyear = true;
            }
            if ((lyear === false) && (dd >= 29)) {
              return false;
            }
            if ((lyear === true) && (dd > 29)) {
              return false;
            }
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
      return true;
    }
  }
};

</script>


<style>
.err {
  font-weight: bold;
  text-align: center;
  color: #DF0000;
  margin-bottom: 1px;
}

.form-control {
  display:inline;
  border: 3px solid silver;
}

.modal-dialog .modal-content {
    border: 3px solid silver;
    border-radius: .25rem;
}

.modal-content table {
  width:100%;
}

.modal-content header h2 {
  font-weight: bold;
  text-align: center;
}

.modal-body h3 {
  font-weight: bold;
}

.modal-body label {
  display: inline-block;
  float: left;
  text-align:right;
  margin: 4px 0 2px 0;
}

.modal-body input {
  width: 45%;
}

.modal-dialog {
  max-width: 600px!important;
}

.deep-purple-skin input[type="text"]:focus:not([readonly])+label {
  color: #6e4ca3!important;
}

.text-right label {
  width:55%;
  font-weight: bold;
}

.modal-body fieldset {
  border: thin solid #6e4ca3;
  border-radius: 1px;
  padding: 0 10px 10px 0;
}

.modal-body legend {
  font-size:medium;
  text-align: center;
  min-width: 0;
  width:auto;
  padding: 0 10px;
  margin: 0;
  border: 0;
}

</style>
