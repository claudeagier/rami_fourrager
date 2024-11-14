<template>
  <v-container
    :id="containerName"
    fluid
    tag="section"
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        class="pt-0 pb-0"
      >
        <base-material-card :color="pageColor">
          <template v-slot:heading>
            <v-row>
              <v-col
                cols="12"
                lg="8"
                md="6"
                sm="6"
              >
                <div class="text-h3 font-weight-light">{{ title }}</div>
                <div class="text-subtitle-1 font-weight-light">{{ subtitle }}</div>
              </v-col>
              <v-col>
                <div>
                  <v-btn
                    :color="pageColor"
                    style="background-color: white"
                    outlined
                    @click="apply"
                  >
                    {{ $t('btn.apply') }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </template>
          <v-card-text>
            <slot name="content" />
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    name: 'pageContainer',
    props: {
      containerName: { type: String },
      pageColor: { type: String },
      title: { type: String },
      subtitle: { type: String },
    },
    methods: {
      apply() {
        this.$emit('apply')
      },
    },
  }
</script>
