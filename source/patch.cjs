const fs = require('fs');
const path = require('path');
const p = path.resolve('src/surfaces/group-3-8104/Group3App.jsx');
let content = fs.readFileSync(p, 'utf-8');
content = content.replace('}, [navigate]);', '}, []);');
content = content.replace(`    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);`, `    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [navigate]);`);
fs.writeFileSync(p, content, 'utf-8');
