package com.example.testapp.data.firebase.network.service

import com.example.testapp.data.firebase.model.dto.*
import retrofit2.http.Body
import retrofit2.http.POST

interface FirebaseFunctionsApi {

    @POST("signup_for_training")
    suspend fun signupForTraining(@Body body: SignupForTrainingRequestDto)

    @POST("delete_raspored_with_prijave")
    suspend fun deleteRaspored(@Body body: DeleteRasporedRequestDto): DeleteResultDto

    @POST("get_attendees_by_raspored")
    suspend fun getAttendees(@Body body: GetAttendeesRequestDto): List<PrijavljeniSudionikDto>

    @POST("set_attendance_for_raspored")
    suspend fun setAttendance(@Body body: SetAttendanceRequestDto): AttendanceUpdateResultDto

    @POST("create_trening")
    suspend fun createTrening(@Body body: CreateTreningRequestDto): CreateTreningResultDto

    @POST("create_raspored")
    suspend fun createRaspored(@Body body: CreateRasporedRequestDto): RasporedDto
}
