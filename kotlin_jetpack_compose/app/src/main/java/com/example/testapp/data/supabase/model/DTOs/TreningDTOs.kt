package com.example.testapp.data.supabase.model.DTOs

import com.example.testapp.domain.model.PrijavljeniSudionik
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class TreningDTO(
    val IdTreninga: String,
    val IdLaksijegTreninga: String? = null,
    val IdTezegTreninga: String? = null,
    val MaksBrojSportasa: Int,
    val VrstaTrening: VrstaTreningaSBDto? = null,
    val Dvorana: DvoranaDTO? = null
)

@Serializable
data class VrstaTreningaSBDto(
    val IdVrTreninga: String,
    val NazivVrTreninga: String,
    val Tezina: Int
)
@Serializable
data class VrstaTreningaDto(
    val id: String,
    val naziv: String,
    val tezina: Int
)

@Serializable
data class TrainingDetailsInnerDto(
    val trening_id: String,
    val vrsta: VrstaTreningaDto
)

@Serializable
data class TrainingDetailsResponseDto(
    val data: TrainingDetailsInnerDto
)

@Serializable
data class RasporedFullDto(
    @SerialName("IdRasporeda") val idRasporeda: String,
    @SerialName("PocetakVrijeme") val pocetakVrijeme: String,
    @SerialName("ZavrsetakVrijeme") val zavrsetakVrijeme: String,
    @SerialName("IdTrenera") val idTrenera: String,
    @SerialName("Trening") val trening: TreningFullDto
)

@Serializable
data class TreningFullDto(
    @SerialName("IdTreninga") val idTreninga: String,
    @SerialName("IdVrTreninga") val idVrTreninga: String,
    @SerialName("IdDvOdr") val idDvOdr: String,
    @SerialName("MaksBrojSportasa") val maksBrojSportasa: Int,
    @SerialName("Dvorana") val dvorana: DvoranaFullDto,
    @SerialName("VrstaTrening") val vrstaTrening: VrstaTreningaFullDto
)

@Serializable
data class DvoranaFullDto(
    @SerialName("IdDvorane") val idDvorane: String,
    @SerialName("NazivDvorane") val nazivDvorane: String,
    @SerialName("Teretana") val teretana: TeretanaFullDto
)

@Serializable
data class TeretanaFullDto(
    @SerialName("IdTeretane") val idTeretane: String,
    @SerialName("NazivTeretane") val nazivTeretane: String,
    @SerialName("Adresa") val adresa: String,
    @SerialName("Mjesto") val mjesto: String
)

@Serializable
data class VrstaTreningaFullDto(
    @SerialName("IdVrTreninga") val idVrTreninga: String,
    @SerialName("NazivVrTreninga") val nazivVrTreninga: String,
    @SerialName("Tezina") val tezina: Int
)


@Serializable
data class AttendeesResponseDto(
    @SerialName("data") val data: List<AttendeeDto>
)

@Serializable
data class AttendeeDto(
    @SerialName("prijava_id") val prijavaId: String,
    @SerialName("sportas_id") val sportasId: String,
    @SerialName("ime") val ime: String? = null,
    @SerialName("prezime") val prezime: String? = null,
    @SerialName("dolazak_na_trening") val dolazakNaTrening: Boolean,
    @SerialName("ocjena_treninga") val ocjenaTreninga: Int? = null
)

fun AttendeeDto.toDomain(): PrijavljeniSudionik =
    PrijavljeniSudionik(
        prijavaId = prijavaId,
        sportasId = sportasId,
        ime = ime,
        prezime = prezime,
        dolazakNaTrening = dolazakNaTrening,
        ocjenaTreninga = ocjenaTreninga
    )



@Serializable
data class AttendanceUpdateRequestDto(
    @SerialName("raspored_id") val rasporedId: String,
    @SerialName("updates") val updates: List<AttendanceUpdateItemDto>
)

@Serializable
data class AttendanceUpdateItemDto(
    @SerialName("sportas_id") val sportasId: String,
    @SerialName("dolazak") val dolazak: Boolean
)

@Serializable
data class AttendanceUpdateResponseDto(
    @SerialName("success") val success: Boolean,
    @SerialName("updated") val updated: Int
)

@Serializable
data class VrstaTreningaCreateDto(
    val NazivVrTreninga: String,
    val Tezina: Int
)

@Serializable
data class TreningCreateDto(
    val IdTreninga: String? = null,
    val IdDvOdr: String,
    val IdVrTreninga: String? = null,
    val IdLaksijegTreninga: String? = null,
    val IdTezegTreninga: String? = null,
    val MaksBrojSportasa: Int
)

@Serializable
data class CreateTreningRequestDto(
    val trening: TreningCreateDto,
    val vrsta: VrstaTreningaCreateDto? = null
)


@Serializable
data class TreningDtoFull(
    val IdTreninga: String,
    val IdDvOdr: String,
    val IdVrTreninga: String,
    val IdLaksijegTreninga: String? = null,
    val IdTezegTreninga: String? = null,
    val MaksBrojSportasa: Int
)

@Serializable
data class CreateTreningResponseDto(
    val trening: TreningDtoFull,
    val vrsta: VrstaTreningaDtoFull? = null
)

@Serializable
data class VrstaTreningaDtoFull(
    val IdVrTreninga: String,
    val NazivVrTreninga: String,
    val Tezina: Int
)

@Serializable
data class RasporedCreateDto(
    val IdRasporeda: String? = null,
    val IdTreninga: String,
    val PocetakVrijeme: String,
    val ZavrsetakVrijeme: String,
    var IdTrenera: String?
)

@Serializable
data class CreateRasporedRequestDto(
    val raspored: RasporedCreateDto
)

@Serializable
data class RasporedResponseDTO(
    val IdRasporeda: String,
    val IdTreninga: String,
    val PocetakVrijeme: String,
    val ZavrsetakVrijeme: String,
    val IdTrenera: String
)


@Serializable
data class TreningOptionDto(
    val IdTreninga: String,
    val MaksBrojSportasa: Int,
    val VrstaTreninga: VrstaInnerDto,
    val Dvorana: DvoranaInnerDto
) {
    @Serializable data class VrstaInnerDto(
        val IdVrTreninga: String,
        val NazivVrTreninga: String,
        val Tezina: Int
    )

    @Serializable data class DvoranaInnerDto(
        val IdDvorane: String,
        val NazivDvorane: String,
        val Teretana: TeretanaInnerDto
    )

    @Serializable data class TeretanaInnerDto(
        val IdTeretane: String,
        val NazivTeretane: String,
        val Adresa: String,
        val Mjesto: String
    )
}

@Serializable
data class DeleteRasporedResponseDto(
    val success: Boolean
)





