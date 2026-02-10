package com.example.testapp.data.supabase.network.service

import androidx.privacysandbox.tools.core.model.Method
import com.example.testapp.data.supabase.model.DTOs.AttendanceUpdateItemDto
import com.example.testapp.data.supabase.model.DTOs.AttendanceUpdateRequestDto
import com.example.testapp.data.supabase.model.DTOs.AttendanceUpdateResponseDto
import com.example.testapp.data.supabase.model.DTOs.AttendeeDto
import com.example.testapp.data.supabase.model.DTOs.AttendeesResponseDto
import com.example.testapp.data.supabase.model.DTOs.AvailableTrainingEdgeDto
import com.example.testapp.data.supabase.model.DTOs.AvailableTrainingEdgeResponseDto
import com.example.testapp.data.supabase.model.DTOs.CreateRasporedRequestDto
import com.example.testapp.data.supabase.model.DTOs.CreateTreningRequestDto
import com.example.testapp.data.supabase.model.DTOs.CreateTreningResponseDto
import com.example.testapp.data.supabase.model.DTOs.DeleteRasporedResponseDto
import com.example.testapp.data.supabase.model.DTOs.DvoranaDTO
import com.example.testapp.data.supabase.model.DTOs.KorisnikDTO
import com.example.testapp.data.supabase.model.DTOs.PrijavaFullDto
import com.example.testapp.data.supabase.model.DTOs.RasporedDTO
import com.example.testapp.data.supabase.model.DTOs.RasporedFullDto
import com.example.testapp.data.supabase.model.DTOs.SignUpErrorResponse
import com.example.testapp.data.supabase.model.DTOs.TeretanaDTO
import com.example.testapp.data.supabase.model.DTOs.TrainingDetailsInnerDto
import com.example.testapp.data.supabase.model.DTOs.TrainingDetailsResponseDto
import com.example.testapp.data.supabase.model.DTOs.TreningOptionDto
import com.example.testapp.data.supabase.model.DTOs.VrstaTreningaDto
import com.example.testapp.data.supabase.model.DTOs.VrstaTreningaDtoFull
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.exceptions.UnauthorizedRestException
import io.github.jan.supabase.functions.functions
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Order
import io.ktor.client.call.body
import io.ktor.client.plugins.ResponseException
import io.ktor.client.request.parameter
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.client.utils.EmptyContent.contentType
import io.ktor.http.ContentType
import io.ktor.http.HttpMethod
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import kotlinx.serialization.json.Json
import java.time.LocalDate
import javax.inject.Inject

class SupabaseTrainingService @Inject constructor(
    private val client: SupabaseClient
) {
    private val json = Json { ignoreUnknownKeys = true }

    suspend fun getTrainingsForUser(userId: String): List<PrijavaFullDto> {

        val selectColumns = Columns.raw("""
        IdPrijave,
        IdSportasa,
        DolazakNaTrening,
        OcjenaTreninga,
        Raspored:IdRasporeda(
            IdRasporeda,
            PocetakVrijeme,
            ZavrsetakVrijeme,
            IdTrenera,
            Trening:IdTreninga(
                IdTreninga,
                IdVrTreninga,
                IdDvOdr,
                MaksBrojSportasa,
                Dvorana:IdDvOdr(
                    IdDvorane,
                    NazivDvorane,
                    Teretana:IdTeretane(
                        IdTeretane,
                        NazivTeretane,
                        Adresa,
                        Mjesto
                    )
                ),
                VrstaTrening:IdVrTreninga(
                IdVrTreninga,
                        NazivVrTreninga,
                        Tezina
                )
            )
        )
    """.trimIndent())

        val dtoList = client.from("Prijava")
            .select(selectColumns) {
                filter { eq("IdSportasa", userId) }
            }
        return dtoList.decodeList<PrijavaFullDto>()
    }

    suspend fun getAvailableTrainings(
        date: LocalDate,
        teretanaId: String
    ): List<AvailableTrainingEdgeDto> {
        val response = client.functions.invoke(
            function = "trainings_by_dvorana_date"
        ){

        parameter("date", date)
        parameter("teretanaId", teretanaId)
    }
        val result: AvailableTrainingEdgeResponseDto = response.body()
        return result.data
    }

    suspend fun signUpForTraining(
        rasporedId: String,
        korisnikId: String
    ): Boolean {
        try {

            client.functions.invoke(
                function = "signup_for_training"
            ) {
                contentType(io.ktor.http.ContentType.Application.Json)
                setBody(
                    mapOf(
                        "korisnik_id" to client.auth.currentUserOrNull()?.id,
                        "raspored_id" to rasporedId
                    )
                )
            }

            return true

        } catch (e: UnauthorizedRestException) {
            val bodyText = e.error

            val errorDto = runCatching {
                json.decodeFromString<SignUpErrorResponse>(bodyText)
            }.getOrNull()

            val msg = errorDto?.error ?: errorDto?.details ?: bodyText

            throw Exception("Prijava nije uspjela: $msg", e)
        }
    }


    suspend fun getTrainingDetails(treningId: String): TrainingDetailsInnerDto {
        val response = client.functions.invoke(
            function = "get_trening_info"
        ) {
            parameter("trening_id", treningId)
        }

        val dto = response.body<TrainingDetailsResponseDto>()
        return dto.data
    }
    suspend fun getDvorane(): List<DvoranaDTO> {
        return client
            .postgrest["Dvorana"]
            .select {
            }
            .decodeList<DvoranaDTO>()
    }

    suspend fun getTeretane(): List<TeretanaDTO> {
        return client
            .from("Teretana")
            .select()
            .decodeList<TeretanaDTO>()
    }

    suspend fun getTrainingsForTrainer(trenerId: String): List<RasporedFullDto> {

        val selectColumns = Columns.raw(
            """
            IdRasporeda,
            PocetakVrijeme,
            ZavrsetakVrijeme,
            IdTrenera,
            Trening:IdTreninga(
                IdTreninga,
                IdVrTreninga,
                IdDvOdr,
                MaksBrojSportasa,
                Dvorana:IdDvOdr(
                    IdDvorane,
                    NazivDvorane,
                    Teretana:IdTeretane(
                        IdTeretane,
                        NazivTeretane,
                        Adresa,
                        Mjesto
                    )
                ),
                VrstaTrening:IdVrTreninga(
                    IdVrTreninga,
                    NazivVrTreninga,
                    Tezina
                )
            )
            """.trimIndent()
        )

        val dtoList = client.from("Raspored")
            .select(selectColumns) {
                filter { eq("IdTrenera", trenerId) }
                order("PocetakVrijeme", order = Order.ASCENDING)
            }

        return dtoList.decodeList<RasporedFullDto>()
    }

    suspend fun getAttendeesByRaspored(rasporedId: String): List<AttendeeDto> {
        val response = client.functions.invoke(
            function = "sportasi_na_treningu"
        ) {
            parameter("raspored_id", rasporedId)
        }

        val dto = response.body<AttendeesResponseDto>()
        return dto.data

    }

    suspend fun setAttendanceForRaspored(
        request: AttendanceUpdateRequestDto
    ): AttendanceUpdateResponseDto {
        return client.functions
            .invoke("postavi-prisutstvo") {
                contentType(io.ktor.http.ContentType.Application.Json)
                setBody(request)
            }.body<AttendanceUpdateResponseDto>()
    }

    suspend fun getVrsteTreninga(): List<VrstaTreningaDtoFull> {
        return client.from("VrstaTreninga")
            .select()
            .decodeList<VrstaTreningaDtoFull>()
    }

    suspend fun createTrening(request: CreateTreningRequestDto): CreateTreningResponseDto {
        return client.functions
            .invoke("create-trening-with-vrsta") {
                contentType(ContentType.Application.Json)
                setBody(request)
            }.body()
    }

    suspend fun getTreningOptions(): List<TreningOptionDto> {
        val columns = Columns.raw("""
            IdTreninga,
            MaksBrojSportasa,
            VrstaTreninga:IdVrTreninga(
              IdVrTreninga,
              NazivVrTreninga,
              Tezina
            ),
            Dvorana:IdDvOdr(
              IdDvorane,
              NazivDvorane,
              Teretana:IdTeretane(
                IdTeretane,
                NazivTeretane,
                Adresa,
                Mjesto
              )
            )
        """.trimIndent())

        return client.from("Trening")
            .select(columns)
            .decodeList<TreningOptionDto>()
    }

    suspend fun createRaspored(request: CreateRasporedRequestDto): RasporedDTO {
        request.raspored.IdTrenera= client.auth.currentUserOrNull()?.id.toString()
        val resp = client.functions.invoke("create-raspored") {
            contentType(ContentType.Application.Json)
            setBody(request)
        }
        val created = resp.body<List<RasporedDTO>>()
        return created.first()
    }

    suspend fun deleteRaspored(idRasporeda: String): DeleteRasporedResponseDto {
        val response = client.functions.invoke(
            function = "delete-raspored-with-prijava"
        ) {
            method = HttpMethod.Delete
            parameter("IdRasporeda", idRasporeda)
        }
        return response.body()
    }

}

