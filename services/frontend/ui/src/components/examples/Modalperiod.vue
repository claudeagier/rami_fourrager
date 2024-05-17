<template>
  <v-dialog
    v-model="showModal"
    persistent
  >
    <v-card>
      <v-card-title>Ajouter un lot</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="add">
          <!-- Tableau des saisies des périodes -->
          <v-container>
            <v-table
              fixed-header
              density="comfortable"
            >
              <thead>
                <tr>
                  <th></th>
                  <th
                    v-for="(period, index) in periods"
                    :key="index"
                  >
                    {{ period.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Présence en bâtiment</td>
                  <td
                    v-for="(period, index) in periods"
                    :key="index"
                  >
                    <v-text-field
                      v-model.number="period.presence"
                      :rules="[rules.required, rules.integer, presenceRule]"
                      type="number"
                      class="period-input"
                      hide-spin-buttons
                      min="0"
                    ></v-text-field>
                  </td>
                </tr>
                <tr>
                  <td>Nombre de jours de présence (sur 28 jours)</td>
                  <td
                    v-for="(period, index) in periods"
                    :key="index"
                  >
                    <v-text-field
                      v-model.number="period.days"
                      :rules="[rules.required, rules.integer, daysRule]"
                      type="number"
                      class="period-input"
                      hide-spin-buttons
                      min="0"
                    ></v-text-field>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-container>
          <!-- Fin du tableau des saisies des périodes -->

          <v-btn @click="cancelAdd">Annuler</v-btn>
          <v-btn
            :disabled="!isFormValid"
            type="submit"
            color="primary"
          >
            Ajouter
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
  /* .bordered-table th {
    padding-bottom: 2px;
  } */
  .bordered-table {
    border-collapse: collapse;
  }
  .bordered-table tr {
    margin-top: 8px;
  }

  .bordered-table td {
    border-right: 1px solid #ccc;
    border-bottom: 2px solid #585858;
  }

  .period-header {
    background-color: #f0f0f0; /* Couleur de fond pour les en-têtes des périodes */
  }

  /* .period-input {
    background-color: #e6f7ff;
    border: 1px solid #b3d9ff;
  } */
</style>

<script>
  export default {
    name: 'ModalHerd',
    props: ['showModal'],
    data() {
      return {
        periods: [
          {
            name: 'Période 1',
            startDate: '01/01/2024',
            endDate: '28/01/2024',
            presence: 0,
            days: 28,
          },
          {
            name: 'Période 2',
            startDate: '29/01/2024',
            endDate: '25/02/2024',
            presence: 0,
            days: 28,
          },
          {
            name: 'Période 3',
            startDate: '26/02/2024',
            endDate: '24/03/2024',
            presence: 0,
            days: 28,
          },
          {
            name: 'Période 4',
            startDate: '25/03/2024',
            endDate: '21/04/2024',
            presence: 0,
            days: 28,
          },
          {
            name: 'Période 5',
            startDate: '22/04/2024',
            endDate: '19/05/2024',
            presence: 0,
            days: 28,
          },
          {
            name: 'Période 6',
            startDate: '20/05/2024',
            endDate: '16/06/2024',
            presence: 0,
            days: 28,
          },
          {
            name: 'Période 7',
            startDate: '17/06/2024',
            endDate: '14/07/2024',
            presence: 0,
            days: 28,
          },
          {
            name: 'Période 8',
            startDate: '15/07/2024',
            endDate: '11/08/2024',
            presence: 0,
            days: 28,
          },
          {
            name: 'Période 9',
            startDate: '12/08/2024',
            endDate: '08/09/2024',
            presence: 0,
            days: 28,
          },
          {
            name: 'Période 10',
            startDate: '09/09/2024',
            endDate: '06/10/2024',
            presence: 0,
            days: 28,
          },
          {
            name: 'Période 11',
            startDate: '07/10/2024',
            endDate: '03/11/2024',
            presence: 0,
            days: 28,
          },
          {
            name: 'Période 12',
            startDate: '04/11/2024',
            endDate: '01/12/2024',
            presence: 0,
            days: 28,
          },
          {
            name: 'Période 13',
            startDate: '02/12/2024',
            endDate: '29/12/2024',
            presence: 0,
            days: 28,
          },
        ],
        rules: {
          required: (val) => !!val || 'Ce champ est requis',
          integer: (val) => /^\d+$/.test(val) || 'Ce champ doit être un entier',
        },
      }
    },
    computed: {
      isFormValid() {
        if (!this.validateForm()) {
          return false
        }
        return true
      },
    },
    methods: {
      presenceRule(val) {
        if (!val) return true
        return (
          parseInt(val) <= parseInt(this.animalCount) ||
          "La présence en bâtiment doit être inférieure ou égale au nombre d'animaux"
        )
      },

      daysRule(val) {
        if (!val) return true
        return parseInt(val) <= 28 || 'Le nombre de jours de présence doit être inférieur ou égal à 28'
      },
      add() {
        if (this.selectedType && this.animalCount && this.validateForm()) {
          this.$emit('add-lot', {
            type: this.selectedType,
            count: this.animalCount,
            periods: this.periods,
          })
          this.resetForm()
        }
      },
      cancelAdd() {
        this.resetForm()
        this.$emit('cancel-add-lot')
      },
      resetForm() {
        this.selectedType = null
        this.animalCount = null
        this.periods.forEach((period) => {
          period.presence = 0
          period.days = 28
        })
      },
      validateForm() {
        for (const period of this.periods) {
          if (!this.validatePeriod(period)) {
            return false
          }
        }
        return true
      },
      validatePeriod(period) {
        if (!period.presence || !period.days) {
          return false
        }
        // Vérifie si le nombre de périodes de présence est inférieur ou égal au nombre d'animaux
        if (parseInt(period.presence) > parseInt(this.animalCount)) {
          return false
        }
        // Vérifie si le nombre de jours de présence est inférieur ou égal à 28
        if (parseInt(period.days) > 28) {
          return false
        }
        return true
      },
    },
  }
</script>
