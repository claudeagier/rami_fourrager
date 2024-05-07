<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        md="4"
        sm="8"
      >
        <base-material-card color="green">
          <template v-slot:heading>
            <div class="text-h3 font-weight-light">Login</div>
            <!--
              <div class="text-subtitle-1 font-weight-light">
                Created using Roboto Font Family
              </div> -->
          </template>

          <v-card-text>
            <v-container
              class="pa-0"
              fluid
            >
              <v-form>
                <v-text-field
                  v-model="email"
                  label="Email"
                  name="login"
                  prepend-icon="person"
                  type="text"
                />

                <v-text-field
                  id="password"
                  v-model="password"
                  label="Password"
                  name="password"
                  prepend-icon="lock"
                  type="password"
                />
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              @click="login"
            >
              Login
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
      }
    },
    methods: {
      login() {
        const email = this.email
        const password = this.password
        this.$store
          .dispatch('auth/login', { email, password })
          .then(() => this.$router.push('/workspace'))
          .catch((err) => console.error(err))
      },
    },
  }
</script>

<style scoped></style>
