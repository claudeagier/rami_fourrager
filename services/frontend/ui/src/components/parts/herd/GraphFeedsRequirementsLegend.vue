<template>
  <v-container fluid>
    <v-row class="py-0">
      <!-- Besoin MS -->
      <v-col cols="12">
        <v-row
          align="center"
          justify="start"
        >
          <v-icon
            color="#c1232b"
            size="16"
          >
            mdi-minus
          </v-icon>
          <span class="legend-title ml-2"> {{ $t('herd.details.graph.legend.ms') }} </span>
        </v-row>
      </v-col>

      <!-- Pâture -->
      <v-col cols="12">
        <v-row
          align="center"
          justify="start"
        >
          <v-sheet
            color="#00CC00"
            height="14px"
            width="25px"
            rounded
            class="mr-2"
          ></v-sheet>
          <span class="legend-title">{{ $t('herd.details.graph.legend.pasture') }} </span>
        </v-row>
      </v-col>

      <!-- Foin -->
      <v-col cols="12">
        <v-row
          align="center"
          justify="start"
        >
          <v-sheet
            color="#009933"
            height="14px"
            width="25px"
            rounded
            class="mr-2"
          ></v-sheet>
          <span class="legend-title">{{ $t('herd.details.graph.legend.hay') }}</span>
        </v-row>
      </v-col>

      <!-- Ensilage et enrubannage d'herbe -->
      <v-col cols="12">
        <v-row
          align="center"
          justify="start"
        >
          <v-sheet
            color="#00FF00"
            height="14px"
            width="25px"
            rounded
            class="mr-2"
          ></v-sheet>
          <span class="legend-title">{{ $t('herd.details.graph.legend.EH') }}</span>
        </v-row>
      </v-col>

      <!-- Ensilage de maïs et sorgho -->
      <v-col cols="12">
        <v-row
          align="center"
          justify="start"
        >
          <v-sheet
            color="orange"
            height="14px"
            width="25px"
            rounded
            class="mr-2"
          ></v-sheet>
          <span class="legend-title">{{ $t('herd.details.graph.legend.EMS') }}</span>
        </v-row>
      </v-col>

      <!-- Ensilage de légumineuses -->
      <v-col cols="12">
        <v-row
          align="center"
          justify="start"
        >
          <v-sheet
            color="#CC6666"
            height="14px"
            width="25px"
            rounded
            class="mr-2"
          ></v-sheet>
          <span class="legend-title">{{ $t('herd.details.graph.legend.EL') }}</span>
        </v-row>
      </v-col>

      <!-- Foin de légumineuses -->
      <v-col cols="12">
        <v-row
          align="center"
          justify="start"
        >
          <v-sheet
            color="#FF66FF"
            height="14px"
            width="25px"
            rounded
            class="mr-2"
          ></v-sheet>
          <span class="legend-title">{{ $t('herd.details.graph.legend.FL') }}</span>
        </v-row>
      </v-col>
      <!-- Autre stock -->
      <v-col cols="12">
        <v-row
          align="center"
          justify="start"
        >
          <v-sheet
            color="#E5E8E8"
            height="14px"
            width="25px"
            rounded
            class="mr-2"
          ></v-sheet>
          <span class="legend-title">{{ $t('herd.details.graph.legend.others') }}</span>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'graph-feeds-requirements-legend',
  }
</script>

<style scoped>
  .ml-12 {
    margin-left: 553.5684px; /* Ajustement pour correspondre à la position d'origine */
  }
  .legen-title {
    font-size: 12px;
    color: #333333;
    font-family: sans-serif;
  }
</style>
