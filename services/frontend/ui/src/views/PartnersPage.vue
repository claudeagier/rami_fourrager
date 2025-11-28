<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        class="text-h5 font-weight-light text-center mb-4"
      >
        {{ $t('partners.interface_funded_by') }}
      </v-col>
    </v-row>

    <!-- Principaux financeurs de l'interface -->
    <v-row
      justify="center"
      align="center"
      dense
      class="mb-8"
    >
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center mb-6"
      >
        <v-img
          max-width="260"
          class="mx-auto mb-4"
          src="@/assets/images/partners/logo_centrevaldeloire.jpg"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        class="text-h6 font-weight-light text-center mb-4"
      >
        {{ $t('partners.project_partners') }}
      </v-col>
    </v-row>

    <!-- Partenaires du projet / autres financeurs -->
    <v-row
      justify="center"
      align="center"
      dense
      class="mb-8"
    >
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center mb-6"
      >
        <v-img
          max-width="260"
          class="mx-auto mb-4"
          src="@/assets/images/partners/logoIdeleRect.jpg"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center mb-6"
      >
        <v-img
          max-width="260"
          class="mx-auto mb-4"
          src="@/assets/images/partners/logo_inrae_bloc.jpg"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        class="text-subtitle-1 font-weight-light text-center mb-8"
      >
        {{ $t('partners.development_supported_by') }}
      </v-col>
    </v-row>

    <!-- Partenaires scientifiques / techniques / soutien au développement -->
    <v-row
      justify="center"
      align="center"
      dense
      class="mb-8"
    >
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center mb-6"
      >
        <v-img
          max-width="260"
          class="mx-auto mb-4"
          src="@/assets/images/partners/logoIdele.png"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center mb-6"
      >
        <v-img
          max-width="260"
          class="mx-auto mb-4"
          src="@/assets/images/partners/logo_cap2er.png"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center mb-6"
      >
        <v-img
          max-width="260"
          class="mx-auto mb-4"
          src="@/assets/images/partners/PraiCos.png"
        />
      </v-col>
    </v-row>

    <v-row
      justify="center"
      align="center"
      dense
      class="mb-8"
    >
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center mb-6"
      >
        <v-img
          max-width="260"
          class="mx-auto mb-4"
          src="@/assets/images/partners/toulouseAgriCampus.jpg"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center mb-6"
      >
        <v-img
          max-width="260"
          class="mx-auto mb-4"
          src="@/assets/images/partners/midi_pyrenees.jpg"
        />
      </v-col>
    </v-row>

    <v-row
      justify="center"
      align="center"
      dense
      class="mb-8"
    >
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center mb-6"
      >
        <v-img
          max-width="260"
          class="mx-auto mb-4"
          src="@/assets/images/partners/MASA_casdar.png"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center mb-6"
      >
        <v-img
          max-width="260"
          class="mx-auto mb-4"
          src="@/assets/images/partners/PSDR3.png"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center mb-6"
      >
        <v-img
          max-width="260"
          class="mx-auto mb-4"
          src="@/assets/images/partners/europe.jpg"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center mb-6"
      >
        <v-img
          max-width="260"
          class="mx-auto mb-4"
          src="@/assets/images/partners/logo-anr.gif"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center mb-6"
      >
        <v-img
          max-width="260"
          class="mx-auto mb-4"
          src="@/assets/images/partners/logo_centrevaldeloire2.png"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'PartnersPage',
  }
</script>
