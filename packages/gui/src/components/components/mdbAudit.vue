<template>
  <VueFocusTrap ref="dialog" @open="open" @gofirst="goFirst" @golast="goLast">
    <section>
      <mdb-modal ref="modal" tabindex="9999" centered v-if="showAuditDetails" :auditData="auditData" @close="closePU()" >
        <mdb-modal-header class="text-center">
          <mdb-modal-title tag="h2" bold class="w-100">Audit Record</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div v-if="auditData">

            <div v-if="!auditData.status">
              No record found for {{auditData.msg}}
            </div>

             <div v-if="auditData.status && auditData.auditRecord.HEADER && auditData.auditRecord.SCHEMA">
               <p class="sr-only" id="Audit_Table_Desc">Audit Record Details</p>
              <table aria-describedby="Audit_Table_Desc" xRef="data">
                <caption class="sr-only">Display audit record header data for selected patient/user</caption>
                <tr><th scope="row" colspan=2><h3>Audit Header</h3></th></tr>
                <tr><th scope="row">Date / Time:</th><td>{{getAuditRecordDT()}}</td></tr>
                <tr><th scope="row">Site / Station #:</th><td>{{auditData.auditRecord.HEADER.Location.Site}} / {{auditData.auditRecord.HEADER.Location.StationNumber}}</td></tr>
                <tr><th scope="row">Patient Name:</th><td><strong>{{auditData.auditRecord.HEADER.Patient.PatientName}}</strong></td></tr>
                <tr><th scope="row">Patient MVI / DFN:</th><td>{{auditData.auditRecord.HEADER.Patient.MVI}} / {{auditData.auditRecord.HEADER.Patient.DFN}} </td></tr>
                <tr><th scope="row">User Name:</th><td><strong>{{auditData.auditRecord.HEADER.User.UserName}}</strong></td></tr>
                <tr><th scope="row">User Title / DUZ / UID:</th><td>{{auditData.auditRecord.HEADER.User.Title}} / {{auditData.auditRecord.HEADER.User.DUZ}} / {{auditData.auditRecord.HEADER.User.UID }}</td></tr>
                <tr><th scope="row">Year / Week #:</th><td>{{auditData.auditRecord.HEADER.Year}} / {{auditData.auditRecord.HEADER.Week}}</td></tr>
                <tr><th scope="row">Request Type:</th><td>{{auditData.auditRecord.HEADER.RequestType}} </td></tr>
                <tr v-if="ExtraData"><th scope="row">Type of Record:</th><td>{{auditData.auditRecord.HEADER.SchemaType}}</td></tr>
              </table>

               <table aria-describedby="Audit_Table_Desc" xRef="data">
                <caption class="sr-only">Display audit record data for selected patient/user</caption>
                <tr><th scope="row" colspan=2><h3>Audit Data</h3></th></tr>
                <tr><th scope="row">Field Name:</th><td>{{auditData.auditRecord.SCHEMA["FIELD NAME"]}}</td></tr>
                <tr><th scope="row">Old Value:</th><td>{{auditData.auditRecord.SCHEMA["OLD VALUE"]}}</td></tr>
                <tr><th scope="row">New Value:</th><td>{{auditData.auditRecord.SCHEMA["NEW VALUE"]}}</td></tr>
                <tr><th scope="row">Menu Option Used:</th><td>{{auditData.auditRecord.SCHEMA["MENU OPTION USED"]}}</td></tr>

                <tr v-if="ExtraData"><th scope="row">Record Added:</th><td>{{auditData.auditRecord.SCHEMA["RECORD ADDED"]}}</td></tr>

                <tr v-if="ExtraData"><th scope="row">Protocol or Option Used:</th><td>{{auditData.auditRecord.SCHEMA["PROTOCOL or OPTION USED"]}}</td></tr>
                <tr v-if="ExtraData"><th scope="row">File Number:</th><td>{{auditData.auditRecord.SCHEMA["FILE NUMBER"]}}</td></tr>
                <tr v-if="ExtraData"><th scope="row">File Name:</th><td>{{auditData.auditRecord.SCHEMA["FILE NAME"]}}</td></tr>

              </table>

            </div>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn center rounded color="secondary" @click.native="closePU()" ref="closePUBtn1">Close</mdb-btn>
        </mdb-modal-footer>
      </mdb-modal>

    </section>
  </VueFocusTrap>
</template>

<script>
import {eventBus} from "../../main";
import { mdbBtn, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter } from "mdbvue"
import { VueFocusTrap } from "vue-a11y-utils";
import mdbModal from "./mdbModal"

const ShowAuditRecord = {
  props: {
    showAuditDetails: false,
    auditData: {}
  },

  data () {
    return {
      auditRecord: {},
      ExtraData: false,
      dialogOpen: false
    }
  },

  name: "MDQAudit",
  components: { eventBus, mdbBtn, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, VueFocusTrap },

  updated() {
    console.log("mdbAudit is updated - ", this.showAuditDetails)
    if (this.showAuditDetails) {
      this.$nextTick(function () {
        const dialog = this.$refs.dialog;
        console.log("Opening the dialog ")
        if (dialog && !this.dialogOpen) {
          console.log("dialog was NOT open")
          this.dialogOpen = true
          dialog.open();
        }
      })
    }
  },


  methods: {
    open() {
      let vm = this;
      setTimeout(function() {
        vm.goFirst();
      }, 400);
    },

    goFirst() {
      this.$refs.closePUBtn1.$el.focus();
    },

    goLast() {
      this.$refs.closePUBtn1.$el.focus();
    },

    getAuditRecordDT() {
      console.log("getAuditRecordDT() - Entry")
      if (this.auditData.auditRecord && this.auditData.auditRecord.HEADER) {
        console.log("getAuditRecordDT() We have a header");
        const x = this.auditData.auditRecord.HEADER.DateTime;
        if (!x) {
          return this.auditData.auditRecord.HEADER
        }

        const s = x.split("-");
        const d = `${s[0]}000000`; // Date and time, padding 0's on the end because sometimes VistA sends a "short" date string
        const z = s[1]; // Zulu offset

        let iso = d.substring(0, 4) + "-" +
        d.substring(4, 6) + "-" + d.substring(6, 8) + "T" +
        d.substring(8, 10) + ":" + d.substring(10, 12) + ":" +
        d.substring(12, 14);
        iso += "-" + z;
        return new Date(iso);
      }
    },

    closePU(){
      const dialog = this.$refs.dialog;
      if (dialog) {
        dialog.close(true);
        this.dialogOpen = false;
      }
      eventBus.$emit("hide", this);
    }
  }
}
export default ShowAuditRecord;
export { ShowAuditRecord as mdbAuditRecord };

</script>

<style>
.modal-content table {
  width:100%;
}

.modal-content header h2, .modal-body h3 {
  font-weight: bold;
  text-align: center;
}

.modal-dialog .modal-content {
    border: 3px solid silver;
    border-radius: .25rem;
}

.modal-dialog {
  max-width: 700px!important;
}

 .modal-body th {
  text-align: right;
  font-weight: bold;
  padding-right: 1em;
  width: 12em;
}

  .modal-body td {
  text-align: left;
 }

 .modal-body p.hide {
  margin: 0;

 }

 .modal-body caption {
  text-align: center;
 }

</style>
