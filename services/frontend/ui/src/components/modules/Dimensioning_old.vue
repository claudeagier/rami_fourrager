<template>
  <v-container>
    module de dimensionnement {{ data.name }}
    <v-row>
      <v-col
        cols="5"
        class="pt-0 pb-0"
      >
        <v-card>
          <v-card-title>Total troupeau</v-card-title>
          <v-card-text>
            <!-- Utilisation des composants de liste pour afficher les valeurs dynamiques -->
            <v-list dense>
              <v-list-item>
                <v-list-item-content>nb animaux: {{ dimensioning.nbAnimaux }}</v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>UGB: {{ dimensioning.ugb }}</v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>Estimation chargement SAU: {{ dimensioning.chargeSAU }}</v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>Chargement apparent: {{ dimensioning.chargeApparent }}</v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>Chargement corrigé: {{ dimensioning.chargeCorrige }}</v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>Chargement potentiel: {{ dimensioning.chargePotentiel }}</v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>Fourrages récoltés: {{ dimensioning.fourragesRecoltes }}</v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>SFP/SAU: {{ dimensioning.sfpSau }}</v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>%PP/SAU: {{ dimensioning.ppSau }}</v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>%PT/SAU: {{ dimensioning.ptSau }}</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="7"
        class="pt-0 pb-0"
      >
        <v-card>
          <v-card-title>
            <div>autonomie et potentiel</div>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'dimenisoning',
    props: {
      pageColor: {
        type: String,
        required: false,
      },
      data: { type: Object },
    },
    computed: {},
    data() {
      return {
        dimensioning: {
          name: 'Nom du module',
          nbAnimaux: 126,
          ugb: 122,
          chargeSAU: 1.01,
          chargeApparent: 1.16,
          chargeCorrige: 1.16,
          chargePotentiel: 1.25,
          fourragesRecoltes: 3.2,
          sfpSau: 88,
          ppSau: 8,
          ptSau: 69,
        },
      }
    },
  }
</script>
