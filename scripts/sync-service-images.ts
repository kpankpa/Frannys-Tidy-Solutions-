import "../lib/db/load-env";
import {
  SERVICE_IMAGE_FILES,
  publicServiceImagePath,
} from "../lib/service-images";
import { listCleaningServices, saveCleaningServices } from "../lib/db/cleaning-services";

async function main() {
  console.log("Syncing cleaning service images from public/...\n");

  const services = await listCleaningServices();
  let updated = 0;

  const next = services.map((service) => {
    const file = SERVICE_IMAGE_FILES[service.id];
    if (!file) {
      console.log(`  SKIP ${service.id}: no local image file mapped`);
      return service;
    }

    const image = publicServiceImagePath(file);
    if (service.image === image) {
      console.log(`  OK   ${service.id} (unchanged)`);
      return service;
    }

    console.log(`  UPD  ${service.id} → ${image}`);
    updated++;
    return { ...service, image };
  });

  if (updated > 0) {
    await saveCleaningServices(next);
    console.log(`\nDone. ${updated} service image(s) updated.`);
  } else {
    console.log("\nDone. All mapped services already use local images.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
