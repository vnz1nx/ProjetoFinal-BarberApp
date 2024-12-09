CREATE TABLE IF NOT EXISTS reserva (
  id BIGSERIAL PRIMARY KEY,
  nome_corte VARCHAR(255) NOT NULL,
  nomeBarbearia VARCHAR(255) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  horario TIMESTAMP NOT NULL,
  user_id BIGINT NOT NULL,
  barber_id BIGINT NOT NULL,
  corte_id BIGINT NOT NULL,
  data_reserva TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES people(id) ON DELETE CASCADE,
  FOREIGN KEY (corte_id) REFERENCES cortes(id) ON DELETE CASCADE,
  FOREIGN KEY (barber_id) REFERENCES barber(id) ON DELETE CASCADE
);