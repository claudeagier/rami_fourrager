<template>
  <div>
    <v-row>
      <!-- Première colonne avec les données de la carte -->
      <v-col
        cols="12"
        class="pt-0 pb-0"
      >
        <v-card
          outlined
          elevation="2"
          class="mb-1"
          style="height: 100%"
        >
          <v-card-title class="text-h4 font-weight-light">Le travail</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row justify="center">
              <v-col cols="5">
                <v-card>
                  <v-card-title> Nb de périodes de distribution de fourrage grossier </v-card-title>
                  <v-card-text>
                    <div>13</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card>
                  <v-card-title> Périodes consécutives sans pâturage (hiver) </v-card-title>
                  <v-card-text>
                    <div>1</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-data-table
              :headers="headers"
              :items="items"
              class="elevation-1"
              item-key="id"
              loading="true"
              hide-default-footer
            >
              <template v-slot:top>
                <v-toolbar
                  color="white"
                  flat
                >
                  <v-toolbar-title class="text-h4 font-weight-light">
                    {{ 'Animaux présents en batiment' }}
                  </v-toolbar-title>
                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  />
                  <v-spacer></v-spacer>
                </v-toolbar>
              </template>
            </v-data-table>
            <v-data-table
              :headers="headers"
              :items="items"
              class="elevation-1"
              item-key="id"
              loading="true"
              hide-default-footer
            >
              <template v-slot:top>
                <v-toolbar
                  color="white"
                  flat
                >
                  <v-toolbar-title class="text-h4 font-weight-light">
                    {{ 'hectares à récolter par période (foin + ensilage + grain + autre)' }}
                  </v-toolbar-title>
                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  />
                  <v-spacer></v-spacer>
                </v-toolbar>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <!-- Première colonne avec les données de la carte -->
      <v-col
        cols="12"
        class="pt-0 pb-0"
      >
        <v-card
          outlined
          elevation="2"
          class="mb-1"
          style="height: 100%"
        >
          <v-card-title class="text-h4 font-weight-light">La gestion du pâturage</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="items"
              class="elevation-1"
              item-key="id"
              loading="true"
              hide-default-footer
            >
              <template v-slot:top>
                <v-toolbar
                  color="white"
                  flat
                >
                  <v-toolbar-title class="text-h4 font-weight-light">
                    {{ "Excédents au pâturage par période (en % du total produit à l'année en pâture)" }}
                  </v-toolbar-title>
                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  />
                  <v-spacer></v-spacer>
                </v-toolbar>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  // TODO traduction
  export default {
    computed: {
      ...mapGetters('referential', {
        periods: 'periodList',
      }),
    },
    data() {
      return {
        headers: [
          {
            text: 'P1',
            value: 'name',
            groupable: false,
          },
          {
            text: 'P1',
            value: 'name',
            groupable: false,
          },
          {
            text: 'P1',
            value: 'name',
            groupable: false,
          },
          {
            text: 'P1',
            value: 'name',
            groupable: false,
          },
          {
            text: 'P1',
            value: 'name',
            groupable: false,
          },
          {
            text: 'P1',
            value: 'name',
            groupable: false,
          },
          {
            text: 'P1',
            value: 'name',
            groupable: false,
          },
          {
            text: 'P1',
            value: 'name',
            groupable: false,
          },
          {
            text: 'P1',
            value: 'name',
            groupable: false,
          },
          {
            text: 'P1',
            value: 'name',
            groupable: false,
          },
          {
            text: 'P1',
            value: 'name',
            groupable: false,
          },
          {
            text: 'P13',
            value: 'name',
            groupable: false,
          },
        ],
        items: [],
      }
    },
  }
</script>
