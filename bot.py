# bot.py - BOT SIMPLES PARA TESTE
import os
import asyncio
import logging
from telegram import Bot
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import sinais

# Configurações
BOT_TOKEN = os.getenv('BOT_TOKEN')
CHANNEL_ID = os.getenv('CHANNEL_ID')

# Logs
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger(__name__)

# Inicializar
bot = Bot(token=BOT_TOKEN)
scheduler = AsyncIOScheduler()

class BotSinais:
    def criar_mensagem(self, sinal):
        emoji = "🟢" if sinal['direcao'] == 'COMPRA' else "🔴"
        
        return f"""
✅ ATIVO {sinal['ativo']}
🕒 Horário: {sinal['horario']}
🎯 Direção: {sinal['direcao']} {emoji}
⏰ Expiração: {sinal['expiração']}
📈 Probabilidade: {sinal['probabilidade']}
🕒 OP 2: {sinal['op2']}
🕒 OP 3: {sinal['op3']}
        """.strip()

    async def enviar_sinal(self, sinal):
        try:
            mensagem = self.criar_mensagem(sinal)
            await bot.send_message(
                chat_id=CHANNEL_ID,
                text=mensagem,
                parse_mode='Markdown'
            )
            logger.info(f"✅ SINAL ENVIADO: {sinal['ativo']} às {sinal['horario']}")
        except Exception as e:
            logger.error(f"❌ ERRO: {e}")

    def agendar_sinais(self):
        logger.info("📅 AGENDANDO SINAIS...")
        
        for sinal in sinais.SINAIS:
            try:
                hora, minuto = sinal['horario'].split(':')
                hora, minuto = int(hora), int(minuto)
                
                scheduler.add_job(
                    self.enviar_sinal,
                    trigger=CronTrigger(hour=hora, minute=minuto),
                    args=[sinal]
                )
                logger.info(f"⏰ Agendado: {sinal['ativo']} às {hora:02d}:{minuto:02d}")
            except Exception as e:
                logger.error(f"❌ Erro: {e}")

    async def iniciar(self):
        try:
            # Verificar configurações
            if not BOT_TOKEN or not CHANNEL_ID:
                logger.error("❌ CONFIGURE BOT_TOKEN e CHANNEL_ID!")
                return

            # Mensagem de início
            await bot.send_message(
                CHANNEL_ID, 
                "🤖 **BOT DE SINAIS ATIVADO!**\n\nSistema iniciado com sucesso! 🚀"
            )
            
            # Agendar sinais
            self.agendar_sinais()
            scheduler.start()
            
            logger.info(f"🎯 BOT INICIADO! {len(sinais.SINAIS)} sinais agendados")
            
            # Manter vivo
            while True:
                await asyncio.sleep(3600)
                
        except Exception as e:
            logger.error(f"❌ ERRO CRÍTICO: {e}")

# Iniciar bot
bot_sinais = BotSinais()

if __name__ == '__main__':
    asyncio.run(bot_sinais.iniciar())
