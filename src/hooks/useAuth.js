import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { loginUser, registerUser, logout, clearError, updateUser } from '../store/authSlice'
import { authService } from '../services/authService'
import { ROLES } from '../utils/constants'

/**
 * Custom hook for authentication state and actions
 */
export function useAuth() {
  const dispatch = useDispatch()
  const { user, token, isAuthenticated, role, loading, error } = useSelector(
    (state) => state.auth
  )

  const login = useCallback(
    async (email, password, role) => {
      const resultAction = await dispatch(loginUser({ email, password, role }))
      if (loginUser.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Login failed')
      }
      return resultAction.payload
    },
    [dispatch]
  )

  const register = useCallback(
    async (userData) => {
      const name = userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
      const payload = {
        ...userData,
        name,
        ...(userData.role !== ROLES.STUDENT && !userData.staffId && userData.studentId ? { staffId: userData.studentId } : {})
      }
      const resultAction = await dispatch(registerUser(payload))
      if (registerUser.rejected.match(resultAction)) {
        const payload = resultAction.payload
        const msg = typeof payload === 'object' && payload !== null ? payload.message : payload || 'Registration failed'
        const err = new Error(msg)
        if (typeof payload === 'object' && payload !== null && payload.code) {
          err.code = payload.code
        }
        throw err
      }
      return resultAction.payload
    },
    [dispatch]
  )

  const updateProfile = useCallback(
    async (userData) => {
      const response = await authService.updateProfile(userData)
      if (response.success) {
        dispatch(updateUser(response.user))
      }
      return response
    },
    [dispatch]
  )

  const logoutUser = useCallback(() => {
    authService.logout()
    dispatch(logout())
  }, [dispatch])

  const clearAuthError = useCallback(() => dispatch(clearError()), [dispatch])

  const isStudent = role === ROLES.STUDENT
  const isFaculty = role === ROLES.FACULTY
  const isAdmin = role === ROLES.ADMIN
  const isExternal = role === ROLES.EXTERNAL
  const isStaff = role === ROLES.STAFF
  const isNonStaff = role === ROLES.NON_STAFF
  const isHod = role === ROLES.HOD
  const isDean = role === ROLES.DEAN
  const isHr = role === ROLES.HR

  return {
    user,
    token,
    isAuthenticated,
    role,
    loading,
    error,
    login,
    registerUser: register,
    register,
    updateProfile,
    logout: logoutUser,
    clearError: clearAuthError,
    isStudent,
    isFaculty,
    isAdmin,
    isExternal,
    isStaff,
    isNonStaff,
    isHod,
    isDean,
    isHr
  }
}
