import ContainerFilter from './ContainerFilter';
import CompetitionList from './CompetitionList';
import { useState } from 'react';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import { Header } from '../components/Header';

function CompetitionPage() {
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);
  return (
    <AuthorizeView>
      <span>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
      </span>
      <Header />
      <div className="Container mt-4">
        <div className="row">
          <div className="col-md-3">
            <ContainerFilter
              selectedContainers={selectedContainers}
              setSelectedContainers={setSelectedContainers}
            />
          </div>
          <div className="col-md-9">
            <CompetitionList selectedContainers={selectedContainers} />
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
}
export default CompetitionPage;
