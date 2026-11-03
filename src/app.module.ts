import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { TicketsModule } from './modules/tickets/tickets.module.js';
import { EspaciosModule } from './modules/espacios/espacios.module.js';
import { VehiculosModule } from './modules/vehiculos/vehiculos.module.js';
import { PagosModule } from './modules/pagos/pagos.module.js';
import { ClientesModule } from './modules/clientes/clientes.module.js';
import { UsuariosModule } from './modules/usuarios/usuarios.module.js';
import { EmpleadosModule } from './modules/empleados/empleados.module.js';
import { TarifasModule } from './modules/tarifas/tarifas.module.js';
import { PensionesModule } from './modules/pensiones/pensiones.module.js';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module.js';
import { SucursalesModule } from './modules/sucursales/sucursales.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'parqueos-api',
    }),
    PrismaModule,
    TicketsModule,
    EspaciosModule,
    VehiculosModule,
    PagosModule,
    ClientesModule,
    UsuariosModule,
    EmpleadosModule,
    TarifasModule,
    PensionesModule,
    AuditLogsModule,
    SucursalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
