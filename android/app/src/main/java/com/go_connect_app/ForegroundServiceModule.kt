package com.go_connect_app

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ForegroundServiceModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ForegroundService"
    }

    @ReactMethod
    fun startForegroundService() {
        val serviceIntent = Intent(reactApplicationContext, MyForegroundService::class.java)
        reactApplicationContext.startForegroundService(serviceIntent)
    }
}
