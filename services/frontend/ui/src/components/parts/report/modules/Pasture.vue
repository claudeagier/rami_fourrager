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
        >
          <v-card-title class="text-h4 font-weight-light">Le travail</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list dense> </v-list>
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
        >
          <v-card-title class="text-h4 font-weight-light">La gestion du paturage</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list dense> </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters(['nameOfGetter']),
    },
  }
</script>
