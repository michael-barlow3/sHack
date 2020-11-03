<template>
  <mdb-container>
      <!-- selectable  -->
    <div class="search">
    <label>Search: <input class="mt-0" v-model="search" /></label>
    </div>
    <mdb-datatable-2
      ref="table"
      :data="data"
      :PatientLookupResults="PatientLookupResults"
      :selectedUser="selectedUser"
      :searching="{value: search, field: 'c'}"
      :tfoot="false"
      sorting striped bordered fixed scrollY small responsiveSm
      maxHeight="55vh"
      selectable
      @selected="selectRow"
      v-model="data"
      class="patient-user-metadata"
      />

  </mdb-container>
</template>

<script>
import {eventBus} from "../../main";
import { mdbInput, mdbDatatable2, mdbContainer } from "mdbvue";

export default {
  components: {
    mdbDatatable2,
    mdbContainer,
    mdbInput
  },

  // params passed here by parent component
  props: {
    data: "",
    PatientLookupResults: "",
    selectedUser: ""
  },

  data() {
    return {
      search: "",
      selected: null,
      columns: [],
      rows: []
    };
  },

  mounted() {
    this.$nextTick(() => {
      // The native component does not have proper scoping
      // nor proper labeling of the first column checkboxes
      // This code rectifies that
      if (this.$refs.table) {
        const table = this.$refs.table.$el;

        const NextPage = table.getElementsByClassName("fa-chevron-right text-");
        const PrevPage = table.getElementsByClassName("fa-chevron-left text-");

        if (NextPage) {
          NextPage[0].parentNode.setAttribute("aria-label", "Next Page");
        }
        if (PrevPage) {
          PrevPage[0].parentNode.setAttribute("aria-label", "Previous Page");
        }

        const rowCells = table.getElementsByTagName("td");
        const headerCells = table.getElementsByTagName("th");
        rowCells.forEach(function(cell, idx, allCells) {
          cell.setAttribute("scope", "col");

          let ckBox = cell.getElementsByTagName("input");
          if (ckBox && ckBox.length > 0) {
            const ckID = `ck4_${idx}`;
            ckBox[0].setAttribute("id", ckID);
            let mtLabel = cell.getElementsByTagName("label");
            if (mtLabel) {
              mtLabel[0].setAttribute("class", "sr-only");
              mtLabel[0].setAttribute("for", ckID);
              let fC = allCells[idx + 1].innerText;
              mtLabel[0].innerText = `Select Row for ${fC} `;
            }
          }
        })
        headerCells.forEach(cell => cell.setAttribute("scope", "col"));
        rowCells[1].setAttribute("scope", "row"); // The second cell indicates the field that was changed which applies to the entire row.
      }
    });
  },

  methods: {
    selectRow (rowData) {
      eventBus.$emit("ShowAuditDetails", rowData);
    },
  }
};
</script>

<!-- /* Prevents the first column (checkbox) from being too large */
/* There's only 2 columns in this data set so this makes sure they take up the rest of the table width */ -->
<style>
div.search {
  text-align: left;
}
div.search input {
  width:300px;
}

.mdb-datatable thead th {
  font-weight: 800!important;
  padding: .25rem!important;
}

.mdb-datatable thead tr th:first-child,
tbody tr td:first-child {
  width: 50px;
  min-width: 50px;
  max-width: 50px;
  word-break: break-all;
}

.patient-user-metadata thead tr th:nth-child(2),
.patient-user-metadata tbody tr td:nth-child(2),
.patient-user-metadata thead tr th:nth-child(3),
.patient-user-metadata tbody tr td:nth-child(3) {
  width: 25%;
  min-width: 25%;
  max-width: 25%;
  word-break: break-all;
}

table.table th, table.table td {
  padding-top: 0.25rem!important;
  padding-bottom: 0.25rem!important;
  vertical-align: middle;
}

.mdb-datatable thead th .mdb-datatable-header-hover-icon,
.mdb-datatable thead th .mdb-datatable-header-icon {
  top: .5rem!important;
  right: 0.1rem;
  left: 95%!important;
  opacity: 1!important;
}



</style>
