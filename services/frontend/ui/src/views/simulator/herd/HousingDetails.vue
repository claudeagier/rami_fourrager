<template>
  <v-tabs
    centered
    :color="pageColor"
  >
    <v-tab
      v-for="(period, index) in 13"
      :key="index"
    >
      Période {{ index + 1 }}
    </v-tab>
    <v-tab-item
      v-for="(period, index) in 13"
      :key="index"
    >
      <v-toolbar
        color="white"
        flat
      >
        <v-toolbar-title> Présence en batiment pour la période {{ index + 1 }} </v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card>
        <v-text-field
          v-model="lots[selectedLot].housing.presence[index].animalCount"
          :rules="[rules.required, rules.integer, presenceRule]"
          type="number"
          label="Nb d'animaux présents"
          hide-spin-buttons
          :color="pageColor"
        ></v-text-field>
        <v-text-field
          v-model="lots[selectedLot].housing.presence[index].days"
          :rules="[rules.required, rules.integer, daysRule]"
          type="number"
          label="Jours de présence en bâtiment (/28)"
          hide-spin-buttons
          :color="pageColor"
        ></v-text-field>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>
