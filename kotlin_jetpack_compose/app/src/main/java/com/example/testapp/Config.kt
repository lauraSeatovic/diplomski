package com.example.testapp

enum class BackendType {
    SUPABASE,
    FIREBASE
}

object AppConfig {
    val backendType: BackendType = BackendType.SUPABASE
}