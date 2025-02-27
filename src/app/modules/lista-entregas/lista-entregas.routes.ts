import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { ListaEntregasComponent } from 'app/modules/lista-entregas/lista-entregas.component';
import { TabelaEntregasComponent } from './tabela-entregas/tabela-entregas.component';
import { EntregasService } from 'app/core/entregas/entregas.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { DetalhesEntregaComponent } from './detalhes-entrega/detalhes-entrega.component';




const entregaResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const entregaService = inject(EntregasService);
    const router = inject(Router);

    return entregaService.getEntregaPorId(route.paramMap.get('id'))
        .pipe(
            // Error here means the requested contact is not available
            catchError((error) => {
                // Log the error
                console.error(error);

                // Get the parent url
                const parentUrl = state.url.split('/').slice(0, -1).join('/');
                // Navigate to there
                router.navigateByUrl(parentUrl);

                // Throw an error
                return throwError(error);
            }),
        );
};


/**
 * Can deactivate contacts details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateEntregaDetalhes = (
    component: DetalhesEntregaComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/contacts'
    // it means we are navigating away from the
    // contacts app
    if (!nextState.url.includes('/lista-entregas')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another contact...
    if (nextRoute.paramMap.get('id')) {
        console.log('nextRoute.paramMap.get(id)', nextRoute.paramMap.get('id'));
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};


export default [
    {
        path: '',
        component: ListaEntregasComponent,
        children: [
            {
                path: '',
                component: TabelaEntregasComponent,
                children: [
                    {
                        path: ':id',
                        component: DetalhesEntregaComponent,
                        resolve: {
                            entrega: entregaResolver,
                        },
                        canDeactivate: [canDeactivateEntregaDetalhes],

                    },
                ],
            },
        ],
    },
] as Routes;
