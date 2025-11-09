import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MachinesService } from '../machines/machines.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const machinesService = app.get(MachinesService);

  try {
    // Check if machines already exist
    const existingMachines = await machinesService.findAll();
    
    if (existingMachines.length > 0) {
      console.log(`✅ ${existingMachines.length} machine(s) already exist in database`);
      console.log('Skipping seed...');
    } else {
      // Create initial machines
      const machines = [
        {
          name: 'Lathe Machine',
          status: 'Running' as const,
          temperature: 75,
          energyConsumption: 1200,
        },
        {
          name: 'CNC Milling Machine',
          status: 'Idle' as const,
          temperature: 65,
          energyConsumption: 800,
        },
        {
          name: 'Injection Molding Machine',
          status: 'Stopped' as const,
          temperature: 85,
          energyConsumption: 1500,
        },
      ];

      for (const machineData of machines) {
        await machinesService.create(machineData);
        console.log(`✅ Created machine: ${machineData.name}`);
      }

      console.log('\n✅ All machines seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding machines:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

