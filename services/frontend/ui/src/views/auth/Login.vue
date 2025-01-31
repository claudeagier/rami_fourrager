<template>
  <v-app id="login">
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
          <template v-slot:actions>
            <div style="width: 85%; padding-right: 20px">
              <v-img src="@/assets/images/bandeau_rami.jpg" />
            </div>
            <v-btn
              color="primary"
              @click="login"
            >
              {{ $t('btn.login') }}
            </v-btn>
          </template>
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
<style scoped>
  #login {
    width: 100%;
    background-image: url('../../assets/images/bocage.jpeg');
    background-size: cover;
  }
</style>
