<template>
  <v-card>
    <v-card-title>Ajouter au Stock Global</v-card-title>
    <v-card-text>
      <v-container>
        <!-- Sélection du type d'aliment -->
        <v-select
          v-model="selectedItemType"
          :items="itemTypes"
          label="Type d'aliment"
        ></v-select>

        <!-- Sélection du type de concentré -->
        <v-select
          v-if="selectedItemType === 'feed'"
          v-model="selectedFeedType"
          :items="feedTypes"
          item-text="name"
          item-value="id"
          label="Type d'aliment"
        ></v-select>

        <v-select
          v-else-if="selectedItemType === 'concentrated_feed'"
          v-model="selectedConcentratedFeed"
          :items="concentratedFeeds"
          item-text="name"
          item-value="id"
          label="Concentré"
        ></v-select>

        <!-- Formulaire pour ajouter l'aliment au stock global -->
        <v-form @submit.prevent="addToBarnStock">
          <v-text-field
            v-model="quantityInDays"
            label="Quantité (en jours)"
          ></v-text-field>
          <v-text-field
            v-model="quantityInTons"
            label="Quantité (en tonnes)"
          ></v-text-field>
          <v-btn
            type="submit"
            color="primary"
            >Ajouter au stock</v-btn
          >
        </v-form>

        <!-- Affichage de la liste des aliments dans le stock global -->
        <v-list>
          <v-list-item
            v-for="(item, index) in barnStock"
            :key="index"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ item.type }} - {{ item.quantity }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        selectedItemType: null,
        selectedFeedType: null,
        selectedConcentratedFeed: null,
        quantityInDays: null,
        quantityInTons: null,
      }
    },
    computed: {
      ...mapState(['simulator']),
      itemTypes() {
        return ['feed', 'concentrated_feed'] // Vous pouvez les récupérer depuis le store si besoin
      },
      feedTypes() {
        return this.$store.getters.feedTypes
      },
      concentratedFeeds() {
        return this.$store.getters.concentratedFeeds
      },
      barnStock() {
        return this.$store.getters.barnStock
      },
    },
    methods: {
      addToBarnStock() {
        let selectedType =
          this.selectedItemType === 'feed'
            ? this.selectedFeedType
            : this.selectedConcentratedFeed

        if (selectedType && (this.quantityInDays || this.quantityInTons)) {
          const selectedFeed =
            this.selectedItemType === 'feed'
              ? this.feedTypes.find((feed) => feed.id === selectedType)
              : this.concentratedFeeds.find(
                  (concentratedFeed) => concentratedFeed.id === selectedType
                )

          if (selectedFeed) {
            this.$store.commit('updateBarnStock', {
              type: selectedFeed.name,
              quantity: {
                days: this.quantityInDays,
                tons: this.quantityInTons,
              },
            })

            this.selectedItemType = null
            this.selectedFeedType = null
            this.selectedConcentratedFeed = null
            this.quantityInDays = null
            this.quantityInTons = null
          }
        } else {
          // Gérer l'erreur ou afficher un message à l'utilisateur
        }
      },
    },
    created() {
      this.$store.dispatch('fetchFeedTypes')
      this.$store.dispatch('fetchConcentratedFeeds')
    },
  }
</script>
