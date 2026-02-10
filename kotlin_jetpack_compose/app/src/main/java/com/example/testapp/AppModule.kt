package com.example.testapp

import com.example.testapp.data.firebase.network.service.FirebaseAuthService
import com.example.testapp.data.firebase.network.service.FirebaseFunctionsApi
import com.example.testapp.data.firebase.network.service.FirebaseRoleService
import com.example.testapp.data.firebase.network.service.FirebaseTrainingService
import com.example.testapp.data.firebase.network.service.FirebaseUserService
import com.example.testapp.data.firebase.repository.AuthRepositoryFirebase
import com.example.testapp.data.firebase.repository.FirebaseTrainingRepositoryImpl
import com.example.testapp.data.firebase.repository.UserRepositoryFirebase
import com.example.testapp.data.supabase.network.service.SupabaseAuthService
import com.example.testapp.data.supabase.network.service.SupabaseTrainingService
import com.example.testapp.data.supabase.network.service.SupabaseUserService
import com.example.testapp.data.supabase.repository.AuthRepositoryImpl
import com.example.testapp.data.supabase.repository.TrainingRepositoryImpl
import com.example.testapp.data.supabase.repository.UserRepositoryImpl
import com.example.testapp.domain.repository.AuthRepository
import com.example.testapp.domain.repository.TrainingRepository
import com.example.testapp.domain.repository.UserRepository
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.functions.FirebaseFunctions
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.functions.Functions
import io.github.jan.supabase.postgrest.Postgrest
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {


    @Provides
    @Singleton
    fun provideSupabaseClient(): SupabaseClient =
        createSupabaseClient(
            supabaseUrl = SupabaseConfig.URL,
            supabaseKey = SupabaseConfig.ANON_KEY
        ) {
            install(Postgrest)
            install(Functions)
            install(Auth)
        }

    @Provides
    @Singleton
    fun provideSupabaseAuthService(client: SupabaseClient): SupabaseAuthService =
        SupabaseAuthService(client)

    @Provides
    @Singleton
    fun provideSupabaseUserService(client: SupabaseClient): SupabaseUserService =
        SupabaseUserService(client)

    @Provides
    @Singleton
    fun provideSupabaseTrainingService(client: SupabaseClient): SupabaseTrainingService =
        SupabaseTrainingService(client)


    @Provides
    @Singleton
    fun provideFirebaseAuth(): FirebaseAuth =
        FirebaseAuth.getInstance()

    @Provides
    @Singleton
    fun provideFirebaseFirestore(): FirebaseFirestore =
        FirebaseFirestore.getInstance()


    @Provides
    @Singleton
    fun provideMoshi(): Moshi =
        Moshi.Builder()
            .add(KotlinJsonAdapterFactory())
            .build()

    @Provides
    @Singleton
    fun provideFirebaseRetrofit(moshi: Moshi): Retrofit =
        Retrofit.Builder()
            .baseUrl(FirebaseConfig.API)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()

    @Provides
    @Singleton
    fun provideFirebaseFunctionsApi(retrofit: Retrofit): FirebaseFunctionsApi =
        retrofit.create(FirebaseFunctionsApi::class.java)

    @Provides
    @Singleton
    fun provideFirebaseFunctions(): FirebaseFunctions =
        FirebaseFunctions.getInstance()


    @Provides
    @Singleton
    fun provideFirebaseAuthService(auth: FirebaseAuth): FirebaseAuthService =
        FirebaseAuthService(auth)

    @Provides
    @Singleton
    fun provideFirebaseRoleService(firestore: FirebaseFirestore): FirebaseRoleService =
        FirebaseRoleService(firestore)

    @Provides
    @Singleton
    fun provideFirebaseUserService(
        firestore: FirebaseFirestore,
        auth: FirebaseAuth
    ): FirebaseUserService =
        FirebaseUserService(firestore, auth)

    @Provides
    @Singleton
    fun provideFirebaseTrainingService(
        function: FirebaseFunctions,
        firestore: FirebaseFirestore
    ): FirebaseTrainingService =
        FirebaseTrainingService(function, firestore)


    @Provides
    @Singleton
    fun provideSupabaseAuthRepositoryImpl(
        supabaseAuthService: SupabaseAuthService
    ): AuthRepositoryImpl =
        AuthRepositoryImpl(supabaseAuthService)

    @Provides
    @Singleton
    fun provideSupabaseUserRepositoryImpl(
        supabaseUserService: SupabaseUserService
    ): UserRepositoryImpl =
        UserRepositoryImpl(supabaseUserService)

    @Provides
    @Singleton
    fun provideSupabaseTrainingRepositoryImpl(
        supabaseTrainingService: SupabaseTrainingService
    ): TrainingRepositoryImpl =
        TrainingRepositoryImpl(supabaseTrainingService)


    @Provides
    @Singleton
    fun provideFirebaseAuthRepositoryImpl(
        firebaseAuthService: FirebaseAuthService,
        firebaseRoleService: FirebaseRoleService
    ): AuthRepositoryFirebase =
        AuthRepositoryFirebase(firebaseAuthService, firebaseRoleService)

    @Provides
    @Singleton
    fun provideFirebaseUserRepositoryImpl(
        firebaseUserService: FirebaseUserService
    ): UserRepositoryFirebase =
        UserRepositoryFirebase(firebaseUserService)

    @Provides
    @Singleton
    fun provideFirebaseTrainingRepositoryImpl(
        firebaseTrainingService: FirebaseTrainingService,
        firebaseAuth: FirebaseAuth
    ): FirebaseTrainingRepositoryImpl =
        FirebaseTrainingRepositoryImpl(firebaseTrainingService, firebaseAuth)


    @Provides
    @Singleton
    fun provideAuthRepository(
        supabaseRepo: AuthRepositoryImpl,
        firebaseRepo: AuthRepositoryFirebase
    ): AuthRepository {
        return when (AppConfig.backendType) {
            BackendType.SUPABASE -> supabaseRepo
            BackendType.FIREBASE -> firebaseRepo
        }


    }

    @Provides
    @Singleton
    fun provideUserRepository(
        supabaseRepo: UserRepositoryImpl,
        firebaseRepo: UserRepositoryFirebase
    ): UserRepository {
        return when (AppConfig.backendType) {
            BackendType.SUPABASE -> supabaseRepo
            BackendType.FIREBASE -> firebaseRepo
        }


    }

    @Provides
    @Singleton
    fun provideTrainingRepository(
        supabaseRepo: TrainingRepositoryImpl,
        firebaseRepo: FirebaseTrainingRepositoryImpl
    ): TrainingRepository {
        return when (AppConfig.backendType) {
            BackendType.SUPABASE -> supabaseRepo
            BackendType.FIREBASE -> firebaseRepo
        }
    }
}
