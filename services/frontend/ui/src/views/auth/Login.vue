<template>
  <v-app>
    <v-row
      align="center"
      justify="center"
    >
      <v-col cols="6">
        <base-material-card color="green">
          <template v-slot:heading>
            <div class="text-h3 font-weight-light">{{ $t('auth.login.title') }}</div>
          </template>

          <v-card-text>
            <v-container
              class="pa-0"
              fluid
            >
              <v-form>
                <v-text-field
                  v-model="email"
                  :label="$t('auth.login.email')"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                />

                <v-text-field
                  id="password"
                  v-model="password"
                  :label="$t('auth.login.password')"
                  name="password"
                  prepend-icon="mdi-lock"
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
              {{ $t('btn.login') }}
            </v-btn>
          </v-card-actions>
        </base-material-card>
      </v-col>
    </v-row>
  </v-app>
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
