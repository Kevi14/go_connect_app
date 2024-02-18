package com.go_connect_app

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import androidx.core.app.NotificationCompat

class MyForegroundService : Service() {

    private val CHANNEL_ID = "ForegroundServiceChannel"

    override fun onStartCommand(intent: Intent, flags: Int, startId: Int): Int {
        createNotificationChannel()
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("App Running in Background")
            .setContentText("This app is running in the background.")
            .setSmallIcon(R.drawable.test)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH) // Set the priority to high
            .setCategory(NotificationCompat.CATEGORY_SERVICE) // Indicate that it's a service notification
            .build()


        startForeground(1, notification)

        // If you want the service to be sticky and restart after being killed, you can change the return here
        return START_STICKY
    }

    override fun onBind(intent: Intent): IBinder? {
        // This is a started service, not a bound service, so we return null
        return null
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "Foreground Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )

            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }
}
