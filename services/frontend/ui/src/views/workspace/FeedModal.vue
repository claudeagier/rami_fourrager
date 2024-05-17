<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">Créer un nouveau feed</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="feed.name"
            :rules="[rules.required]"
            label="Nom"
            required
          ></v-text-field>
          
          <v-text-field
            v-model="feed.correspondingStock"
            :rules="[rules.required]"
            label="Stock Correspondant"
            required
          ></v-text-field>

          <v-subheader>Valeurs Nutritionnelles</v-subheader>

          <v-row>
            <v-col v-for="(value, key) in feed.nutritional_values" :key="key" cols="12" md="6">
              <v-text-field
                v-model="feed.nutritional_values[key]"
                :label="key"
                :rules="[rules.required, rules.number]"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Annuler</v-btn>
        <v-btn color="blue darken-1" text @click="submitForm">Créer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      valid: false,
      feed: {
        name: '',
        correspondingStock: '',
        nutritional_values: {
          UEL: 0,
          UEB: 0,
          UEM: 0,
          UFL: 0,
          PDI_inf: 0,
          UFV: 0,
          PDIN: 0,
          PDIE: 0,
          rejection: 0,
        },
      },
      rules: {
        required: value => !!value || 'Requis.',
        number: value => !isNaN(parseFloat(value)) && isFinite(value) || 'Doit être un nombre.',
      },
    };
  },
  methods: {
    closeDialog() {
      this.dialog = false;
    },
    submitForm() {
      if (this.$refs.form.validate()) {
        // Envoyer les données au serveur ou effectuer une action
        console.log('Feed créé :', this.feed);

        // Réinitialiser le formulaire et fermer le dialogue
        this.$refs.form.reset();
        this.dialog = false;
      }
    },
  },
};
</script>

<style scoped>
/* Ajoutez des styles ici si nécessaire */
</style>
