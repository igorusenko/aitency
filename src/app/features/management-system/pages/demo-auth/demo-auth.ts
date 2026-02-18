import {Component, inject, OnInit} from '@angular/core';
import {ProgressSpinner} from 'primeng/progressspinner';
import {WorkspacesService} from '../../../../core/services/management-system/workspaces/workspaces.service';
import {AuthService} from '../../../../core/services/management-system/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../core/services/management-system/user/user.service';
import {concatMap} from 'rxjs';

@Component({
  selector: 'app-demo-auth',
  imports: [
    ProgressSpinner
  ],
  templateUrl: './demo-auth.html',
  styleUrl: './demo-auth.scss',
})
export class DemoAuth implements OnInit {
  private readonly workspaceService = inject(WorkspacesService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token']
    this.authService.demoLogin({token})
      .pipe(concatMap(() => this.userService.getCurrentUser()))
      .subscribe(x => {
        this.router.navigate(['/home']);
    })
  }
}
