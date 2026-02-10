import '../../model/DTOs/korisnik_dto.dart';
import '../../model/DTOs/sportas_dto.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class UserService {
  final SupabaseClient client;

  UserService(this.client);

  Future<KorisnikDto?> getKorisnik(String id) async {
    final data = await client
        .from('Korisnik')
        .select()
        .eq('IdKorisnika', id)
        .maybeSingle();
    if (data == null) return null;
    return KorisnikDto.fromJson(data);
  }

  Future<SportasDto?> getSportas(String id) async {
    final data = await client
        .from('Sportas')
        .select()
        .eq('IdKorisnika', id)
        .maybeSingle();

    if (data == null) return null;
    return SportasDto.fromJson(data);
  }
}